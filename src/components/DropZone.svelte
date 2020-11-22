<script>
  import { fromEvent } from "file-selector";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  //props
  /**
   * Set accepted file types.
   * See https://github.com/okonet/attr-accept for more information.
   */
  export let accept; // string or string[]
  export let disabled = false;
  export let getFilesFromEvent = fromEvent;
  export let maxSize = Infinity;
  export let minSize = 0;
  export let multiple = true;
  export let preventDropOnDocument = true;
  export let noClick = false;
  export let noKeyboard = false;
  export let noDrag = false;
  export let noDragEventsBubbling = false;
  export let containerClasses = "";
  export let containerStyles = "";
  export let disableDefaultStyles = false;

  const dispatch = createEventDispatcher();

  //state

  let state = {
    isFocused: false,
    isFileDialogActive: false,
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
    draggedFiles: [],
    acceptedFiles: [],
    fileRejections: []
  };

  let rootRef;
  let inputRef;

  const FILE_INVALID_TYPE = "file-invalid-type";
  const FILE_TOO_LARGE = "file-too-large";
  const FILE_TOO_SMALL = "file-too-small";
  const TOO_MANY_FILES = "too-many-files";

  // File Errors
  const getInvalidTypeRejectionErr = (accept) => {
    accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
    const messageSuffix = Array.isArray(accept)
      ? `one of ${accept.join(", ")}`
      : accept;
    return {
      code: FILE_INVALID_TYPE,
      message: `File type must be ${messageSuffix}`,
    };
  };

  const getTooLargeRejectionErr = (maxSize) => {
    return {
      code: FILE_TOO_LARGE,
      message: `File is larger than ${maxSize} bytes`,
    };
  };

  const getTooSmallRejectionErr = (minSize) => {
    return {
      code: FILE_TOO_SMALL,
      message: `File is smaller than ${minSize} bytes`,
    };
  };

  const TOO_MANY_FILES_REJECTION = {
    code: TOO_MANY_FILES,
    message: "Too many files",
  };

    
  /**
   * Check if the provided file type should be accepted by the input with accept attribute.
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept
   *
   * Inspired by https://github.com/enyo/dropzone
   *
   * @param file {File} https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param acceptedFiles {string}
   * @returns {boolean}
   */

  function accepts(file, acceptedFiles) {
    if (file && acceptedFiles) {
      const acceptedFilesArray = Array.isArray(acceptedFiles)
        ? acceptedFiles
        : acceptedFiles.split(",");
      const fileName = file.name || "";
      const mimeType = (file.type || "").toLowerCase();
      const baseMimeType = mimeType.replace(/\/.*$/, "");

      return acceptedFilesArray.some((type) => {
        const validType = type.trim().toLowerCase();
        if (validType.charAt(0) === ".") {
          return fileName.toLowerCase().endsWith(validType);
        } else if (validType.endsWith("/*")) {
          // This is something like a image/* mime type
          return baseMimeType === validType.replace(/\/.*$/, "");
        }
        return mimeType === validType;
      });
    }
    return true;
  }

  // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
  // that MIME type will always be accepted
  function fileAccepted(file, accept) {
    const isAcceptable =
      file.type === "application/x-moz-file" || accepts(file, accept);
    return [
      isAcceptable,
      isAcceptable ? null : getInvalidTypeRejectionErr(accept),
    ];
  }

  function fileMatchSize(file, minSize, maxSize) {
    if (isDefined(file.size)) {
      if (isDefined(minSize) && isDefined(maxSize)) {
        if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
        if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
      } else if (isDefined(minSize) && file.size < minSize)
        return [false, getTooSmallRejectionErr(minSize)];
      else if (isDefined(maxSize) && file.size > maxSize)
        return [false, getTooLargeRejectionErr(maxSize)];
    }
    return [true, null];
  }

  function isDefined(value) {
    return value !== undefined && value !== null;
  }

  // React's synthetic events has event.isPropagationStopped,
  // but to remain compatibility with other libs (Preact) fall back
  // to check event.cancelBubble
  function isPropagationStopped(event) {
    if (typeof event.isPropagationStopped === "function") {
      return event.isPropagationStopped();
    } else if (typeof event.cancelBubble !== "undefined") {
      return event.cancelBubble;
    }
    return false;
  }

  function isEvtWithFiles(event) {
    if (!event.dataTransfer) {
      return !!event.target && !!event.target.files;
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
    return Array.prototype.some.call(
      event.dataTransfer.types,
      (type) => type === "Files" || type === "application/x-moz-file"
    );
  }

  // allow the entire document to be a drag target
  function onDocumentDragOver(event) {
    event.preventDefault();
  }

  function isIe(userAgent) {
    return (
      userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1
    );
  }

  function isEdge(userAgent) {
    return userAgent.indexOf("Edge/") !== -1;
  }

  function isIeOrEdge(userAgent = window.navigator.userAgent) {
    return isIe(userAgent) || isEdge(userAgent);
  }

  function resetState() {
    state.isFileDialogActive = false;
    state.isDragActive = false;
    state.draggedFiles = [];
    state.acceptedFiles = [];
    state.fileRejections = [];
  }

  // Fn for opening the file dialog programmatically
  function openFileDialog() {
    if (inputRef) {
      inputRef.value = null; // TODO check if null needs to be set
      state.isFileDialogActive = true;
      inputRef.click();
    }
  }

  // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
  function onKeyDownCb(event) {
    // Ignore keyboard events bubbling up the DOM tree
    if (!rootRef || !rootRef.isEqualNode(event.target)) {
      return;
    }

    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      openFileDialog();
    }
  }

  // Update focus state for the dropzone
  function onFocusCb() {
    state.isFocused = true;
  }
  function onBlurCb() {
    state.isFocused = false;
  }

  // Cb to open the file dialog when click occurs on the dropzone
  function onClickCb() {
    if (noClick) {
      return;
    }

    // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    // to ensure React can handle state changes
    // See: https://github.com/react-dropzone/react-dropzone/issues/450
    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }

  function onDragEnterCb(event) {
    event.preventDefault();
    stopPropagation(event);

    dragTargetsRef = [...dragTargetsRef, event.target];

    if (isEvtWithFiles(event)) {
      Promise.resolve(getFilesFromEvent(event)).then(draggedFiles => {
        if (isPropagationStopped(event) && !noDragEventsBubbling) {
          return;
        }

        state.draggedFiles = draggedFiles;
        state.isDragActive = true;

        dispatch("dragenter", {
          dragEvent: event
        });
      });
    }
  }

  function onDragOverCb(event) {
    event.preventDefault();
    stopPropagation(event);

    if (event.dataTransfer) {
      try {
        event.dataTransfer.dropEffect = "copy";
      } catch {} /* eslint-disable-line no-empty */
    }

    if (isEvtWithFiles(event)) {
      dispatch("dragover", {
        dragEvent: event
      });
    }

    return false;
  }

  function onDragLeaveCb(event) {
    event.preventDefault();
    stopPropagation(event);

    // Only deactivate once the dropzone and all children have been left
    const targets = dragTargetsRef.filter(
      target => rootRef && rootRef.contains(target)
    );
    // Make sure to remove a target present multiple times only once
    // (Firefox may fire dragenter/dragleave multiple times on the same element)
    const targetIdx = targets.indexOf(event.target);
    if (targetIdx !== -1) {
      targets.splice(targetIdx, 1);
    }
    dragTargetsRef = targets;
    if (targets.length > 0) {
      return;
    }

    state.isDragActive = false;
    state.draggedFiles = [];

    if (isEvtWithFiles(event)) {
      dispatch("dragleave", {
        dragEvent: event
      });
    }
  }

  function onDropCb(event) {
    event.preventDefault();
    stopPropagation(event);

    dragTargetsRef = [];

    if (isEvtWithFiles(event)) {
      Promise.resolve(getFilesFromEvent(event)).then(files => {
        if (isPropagationStopped(event) && !noDragEventsBubbling) {
          return;
        }

        const acceptedFiles = [];
        const fileRejections = [];

        files.forEach(file => {
          const [accepted, acceptError] = fileAccepted(file, accept);
          const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
          if (accepted && sizeMatch) {
            acceptedFiles.push(file);
          } else {
            const errors = [acceptError, sizeError].filter(e => e);
            fileRejections.push({ file, errors });
          }
        });

        if (!multiple && acceptedFiles.length > 1) {
          // Reject everything and empty accepted files
          acceptedFiles.forEach(file => {
            fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
          });
          acceptedFiles.splice(0);
        }

        state.acceptedFiles = acceptedFiles;
        state.fileRejections = fileRejections;

        dispatch("drop", {
          acceptedFiles,
          fileRejections,
          event
        });

        if (fileRejections.length > 0) {
          dispatch("droprejected", {
            fileRejections,
            event
          });
        }

        if (acceptedFiles.length > 0) {
          dispatch("dropaccepted", {
            acceptedFiles,
            event
          });
        }
      });
    }
    resetState();
  }

  function composeHandler(fn) {
    return disabled ? null : fn;
  }

  function composeKeyboardHandler(fn) {
    return noKeyboard ? null : composeHandler(fn);
  }

  function composeDragHandler(fn) {
    return noDrag ? null : composeHandler(fn);
  }

  function stopPropagation(event) {
    if (noDragEventsBubbling) {
      event.stopPropagation();
    }
  }

  let dragTargetsRef = [];
  function onDocumentDrop(event) {
    if (rootRef && rootRef.contains(event.target)) {
      // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return;
    }
    event.preventDefault();
    dragTargetsRef = [];
  }

  // Update file dialog active state when the window is focused on
  function onWindowFocus() {
    // Execute the timeout only if the file dialog is opened in the browser
    if (state.isFileDialogActive) {
      setTimeout(() => {
        if (inputRef) {
          const { files } = inputRef;

          if (!files.length) {
            state.isFileDialogActive = false;
            dispatch("filedialogcancel");
          }
        }
      }, 300);
    }
  }

  onMount(() => {
    window.addEventListener("focus", onWindowFocus, false);
    if (preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }
  });

  onDestroy(() => {
    window.removeEventListener("focus", onWindowFocus, false);
    if (preventDropOnDocument) {
      document.removeEventListener("dragover", onDocumentDragOver);
      document.removeEventListener("drop", onDocumentDrop);
    }
  });

  function onInputElementClick(event) {
    event.stopPropagation();
  }
</script>

<style>
  .dropzone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: #eeeeee;
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;
  }
  .dropzone:focus {
    border-color: #2196f3;
  }
</style>

<div
  bind:this={rootRef}
  tabindex="0"
  class="{disableDefaultStyles ? '' : 'dropzone'}
  {containerClasses}"
  style={containerStyles}
  on:keydown={composeKeyboardHandler(onKeyDownCb)}
  on:focus={composeKeyboardHandler(onFocusCb)}
  on:blur={composeKeyboardHandler(onBlurCb)}
  on:click={composeHandler(onClickCb)}
  on:dragenter={composeDragHandler(onDragEnterCb)}
  on:dragover={composeDragHandler(onDragOverCb)}
  on:dragleave={composeDragHandler(onDragLeaveCb)}
  on:drop={composeDragHandler(onDropCb)}>
  <input
    {accept}
    {multiple}
    type="file"
    autocomplete="off"
    tabindex="-1"
    on:change={onDropCb}
    on:click={onInputElementClick}
    bind:this={inputRef}
    style="display: none;" />
  <slot>
    <p>Drag 'n' drop some files here, or click to select files</p>
  </slot>
</div>