class UI {
  constructor() {
    const that = this;
    this.reader = new FileReader();
    this.$loaded = $("#loaded-data");
    this.$apply = $("#apply-data");
    this.$clear = $("#clear-data");
    this.$upload = $("#upload-data");
    this.$save = $("#save-data");
    this.$reset = $("#reset");
    this.$trained = $("#trained-example");
    this.$unitsSlider = $("#total-units-slider");
    this.$mutationRateSlider = $("#mutation-rate-slider");
    this.$killActive = $("#kill-active");

    this.$save.on('click', this.handleSave.bind(this));
    this.$apply.on('click', this.handleApply.bind(this));
    this.$clear.on('click', this.handleClear.bind(this));
    this.$upload.on('change', this.handleUpload.bind(this));
    this.$reset.on('click', this.handleReset.bind(this));
    this.$killActive.on('click', this.handleKillActive);

    this.$trained.on('change', function(event) {
      const value = $(this).val();
      const data = trained_data[value];
      that.$loaded.val(JSON.stringify(data, 0, 4));
    })

    this.$unitsSlider.ionRangeSlider({
      min: 1,
      max: 250,
      grid: true,
      skin: "modern",
      from: population.total,
      onFinish: function(data) {
        population.total = data.from;
      }
    });

    this.$mutationRateSlider.ionRangeSlider({
      min: 0,
      max: 1,
      step: 0.01,
      grid: true,
      skin: "modern",
      from: population.mutationRate,
      onFinish: function(data) {
        console.log(data)
        population.mutationRate = data.from;
      }
    });
  }

  handleClear() {
    this.$loaded.val("");
  }

  handleKillActive() {
    population.killActive();
  }

  handleReset() {
    population = new Population(Player, population.total);
    this.$loaded.val("");
    this.$trained.val("");

    obstacles = [];
    frameCount = 0;
    speed = 5;
    time = 0;
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
    const value = this.$loaded.val();

    if(value.length) {
      try {
        const data = JSON.parse(value);

        if(Array.isArray(data)) {
          population.load(data);
          this.$loaded.val("");
          this.$trained.val("");
        }
      } catch (err) {
        console.log('Not valid data type.')
      }

    }
  }
}