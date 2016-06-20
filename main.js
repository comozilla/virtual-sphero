function VirtualPlugin() {
  this.name = "virtual";
  this.directory = __dirname + "/virtual";
}

VirtualPlugin.prototype.command = function(commandName, args) {
  console.log("receive command! : " + commandName);
}

module.exports = VirtualPlugin;

