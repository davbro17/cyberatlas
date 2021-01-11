import validate from "validate.js";
import moment from "moment";

validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function(value, options) {
      return +moment.utc(value);
    },
    // Input is a unix timestamp
    format: function(value, options) {
      var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
      return moment.utc(value).format(format);
    }
});
validate.validators.type.types.stringArray = function (value) { return (value instanceof Array) && value.reduce((accum, cv) => accum && typeof cv === "string", true); };
validate.validators.type.types.integerArray = function (value) { return (value instanceof Array) && value.reduce((accum, cv) => accum && Number.isInteger(cv), true); };

export default validate;