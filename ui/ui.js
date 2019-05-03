class UI {
  constructor() {
    this.reader = new FileReader();
    this.$loaded = $("#loaded-data");
    this.$apply = $("#apply-data");
    this.$upload = $("#upload-data");
    this.$save = $("#save-data");

    this.$save.on('click', this.handleSave.bind(this));
    this.$apply.on('click', this.handleApply.bind(this));
    this.$upload.on('change', this.handleUpload.bind(this));
  }

  handleUpload(event) {
    const file = event.target.files[0];

    if(file) {
      this.reader.onload = this.handleReaderLoad.bind(this);
      this.reader.readAsText(file);
      this.$loaded.focus()
    }
  }

  handleReaderLoad(event) {
    var data = event.target.result;
    this.$loaded.val(data)
  }

  handleSave(event) {
    const data = population.best.getData();
    saveJSON(data, 'data.json')
  }

  handleApply() {
    const data = this.$loaded.val();
    population.load(JSON.parse(data));
    this.$loaded.val("")
  }
}