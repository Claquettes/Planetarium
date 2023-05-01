function clearButton() {
    //on demande confirmation
    if (confirm("Voulez-vous vraiment tout effacer ?")) {
    canvasArray = new Array(10).fill(0).map(() => new Array(10).fill("void"));
    }
  }
    
  function saveButton() {
    setTimeout(() => {
      const dataURL = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a');
      //on demande le nom du fichier
      let filenamepng = prompt("Name of your creation :");
      filenamepng = filenamepng + ".png";
      downloadLink.href = dataURL;
      downloadLink.download = filenamepng;
      downloadLink.click();
    }, 800);
  }
  
  function gitButton() {
    window.open("https://github.com/Claquettes/Planetarium");
  }
  
  function cycleButton() {
    if(noCycle) {
      noCycle = false;
    } else {
      noCycle = true;
    }
    console.log(noCycle)
  }
  
  function freezeTimeButton() {
    if(freezeTime) {
      freezeTime = false;
    } else {
      freezeTime = true;
    }
    console.log(freezeTime)
  }
  
  function exportButton(){ //we export the canvas as a json file
    console.dir(canvasArray)
      let data = [];
      //for each tile, we get the image source and the position
  
      canvasArray.forEach((row, i) => {
        row.forEach((tile, j) => {
          console.log(canvasArray[i][j])
          let imgTag = canvasArray[i][j];
          data.push({imgTag, i, j});
        })
      });
      let json = JSON.stringify({width: canvas.width/tileSize, height: canvas.height/tileSize, tiles: data});
      //we create a json file
      let blob = new Blob([json], {type: "application/json"});
      let url  = URL.createObjectURL(blob);
      //we download the file
      let a = document.createElement('a');
      //on met le nom du fichier, en ajoutant l'heure et la date
      let filename = prompt("Name of your creation :");
      filename += ".json";
      a.download    = filename;
      a.href        = url;
      a.textContent = "Download file";
      a.click();
  }

