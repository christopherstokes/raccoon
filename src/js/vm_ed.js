// Raccoon vm editor

function rcn_vm_ed() {
  this.__proto__.__proto__ = rcn_window.prototype;
  rcn_window.call(this, 'vm_ed', 'Virtual Machine');

  this.vm = rcn_global_vm = new rcn_vm();
  this.add_child(this.vm.canvas.node);

  var vm_ed = this;

  // Create reboot button
  this.reboot_button = document.createElement('input');
  this.reboot_button.type = 'button';
  this.reboot_button.value = 'Reboot';
  this.reboot_button.onclick = function() {
    vm_ed.reboot();
  }
  this.add_child(this.reboot_button);

  // Create autoapply checkbox
  var autoapply_checkbox_id = 'autoapply_checkbox'; // TODO: this will have to depend on window id
  this.autoapply_checkbox = document.createElement('input');
  this.autoapply_checkbox.id = autoapply_checkbox_id;
  this.autoapply_checkbox.type = 'checkbox';
  this.autoapply_checkbox.checked = true;
  this.add_child(this.autoapply_checkbox);
  this.autoapply_checkbox_label = document.createElement('label');
  this.autoapply_checkbox_label.htmlFor = autoapply_checkbox_id;
  this.autoapply_checkbox_label.innerText = 'Autoapply';
  this.add_child(this.autoapply_checkbox_label);

  // Create error log
  this.error_log = document.createElement('div');
  this.error_log.classList.add('error_log');
  this.vm.vm_ed = this;
  this.vm.onexception = function(e) {
    var error_message = document.createElement('p');
    error_message.innerText = 'Error: ' + e.message + ' (line: ' + e.line + ', column: ' + e.column + ')';
    this.vm_ed.error_log.appendChild(error_message);
  }
  this.add_child(this.error_log);

  this.addEventListener('rcnbinchange', function(e) {
    if(e.detail.load) {
      // We just loaded a new bin, therefore we reboot
      vm_ed.reboot();
    } else if(vm_ed.autoapply_checkbox.checked) {
      // If autoapply is on, we directly load changed rom into ram
      vm_ed.vm.load_memory(rcn_global_bin.rom.slice(e.detail.begin, e.detail.end), e.detail.begin);
    }
  });
}

rcn_vm_ed.prototype.reboot = function() {
  while (this.error_log.firstChild) {
    this.error_log.removeChild(this.error_log.firstChild);
  }
  this.vm.load_bin(rcn_global_bin);
}
