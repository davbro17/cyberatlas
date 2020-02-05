import isIp from "is-ip";
import {
  transformBox,
  transformGroup,
  transformDevice
} from "../utility/transformBox.js";

let subnetConfig = {
  name: "Subnet",
  icon: "network-wired",
  component: "SubnetConfig",
  id: Date.now(),
  lines: [],
  commands: [],
  style: {
    fillColor: "#d5e8d4",
    rounded: 0,
    verticalAlign: "top",
    fontStyle: 1
  },
  label: "",
  geometry: {
    x: 0,
    y: 0,
    width: 810,
    height: 100
  },
  margin: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  padding: {
    top: 10,
    left: 10
  },
  device: {
    columns: 10,
    width: 70,
    height: 70,
    padding: {
      top: 30,
      left: 10
    },
    style: {
      shape: "mxgraph.citrix.desktop",
      verticalLabelPosition: "bottom",
      aspect: "fixed",
      html: 1,
      verticalAlign: "top",
      align: "center",
      outlineConnect: 0
    },
    background: {
      verticalLabelPosition: "bottom",
      aspect: "fixed",
      html: 1,
      verticalAlign: "top",
      fillColor: "none",
      strokeColor: "none",
      align: "center",
      outlineConnect: 0
    }
  }
};

function transformSubnet(subnet, data, state, devices) {
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  // Filter and sort all the ip addresses
  let sortedDevices = Object.keys(devices)
    .filter(entry => isIp(entry))
    .sort((a, b) => {
      const num1 = Number(
        a
          .split(".")
          .map(num => `000${num}`.slice(-3))
          .join("")
      );
      const num2 = Number(
        b
          .split(".")
          .map(num => `000${num}`.slice(-3))
          .join("")
      );
      return num1 - num2;
    });
  // Create State
  state = state || { id: 2, parent: 1, vertex: 1 };
  let output = "";
  // Create the BIG box group
  // Set the parent to the document parent
  output += transformGroup(state, subnet.geometry, state.docparent);
  // Check if the subnet has a label, if so adjust top padding
  if (subnet.label.length) {
    subnet.padding.top += 20;
    subnet.geometry.height += 20;
  }
  // Create big box
  output += transformBox(
    state,
    {
      x: 0,
      y: 0,
      width: subnet.geometry.width,
      height: subnet.geometry.height
    },
    subnet.style,
    state.parent,
    subnet.label
  );
  let oldParent = state.id;
  let x0 = subnet.padding.left;
  let x = x0;
  let y = subnet.padding.top;
  let width = subnet.device.width;
  let height = subnet.device.height;
  let paddingx = subnet.device.padding.left;
  let paddingy = subnet.device.padding.top;
  let deviceCount = 1;
  let devicesPerRow = subnet.device.columns;
  for (let i = 0; i < sortedDevices.length; i++) {
    // Create Geometry
    let geometry = {
      x: x,
      y: y,
      width: width,
      height: height
    };
    // Create Group
    output += transformGroup(state, geometry, oldParent);
    geometry.x = 0;
    geometry.y = 0;
    // Create Device Background
    output += transformBox(
      state,
      geometry,
      subnet.device.background,
      state.parent
    );
    // Create Device

    const ip = sortedDevices[i];
    output += transformDevice(state, geometry, subnet.device.style, ip);
    // Change Geometry
    if (deviceCount < devicesPerRow) {
      x += width + paddingx;
      deviceCount += 1;
    } else {
      x = x0;
      y += height + paddingy;
      deviceCount = 1;
    }
  }
  return output;
}

export { transformSubnet, subnetConfig };
