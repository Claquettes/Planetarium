function clearButton() {
    //on demande confirmation
    if (confirm("Voulez-vous vraiment tout effacer ?")) {
    canvasArray = new Array(10).fill(0).map(() => new Array(10).fill("void"));
    }
  }
  
  function eraserButton() {
    if(erase) { //si on est déjà en mode gomme, on désactive
      erase = false;
      //on remet la couleur du bouton à la normale
      document.getElementById("eraser").style.backgroundColor = "white";
    } else { //sinon on active le mode gomme
      selectedImage = null;
      erase = true;
      document.getElementById("eraser").style.backgroundColor = "red";
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
    window.open("https://github.com/Claquettes/garden");
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

//we import a json file in the "gardenInput" input
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    console.log('Selected file:', file);
    //when we select a file, we read it, and then we draw the images on the canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      let height = json["height"];
      let width = json["width"];
      canvas.width = height*tileSize;
      canvas.height = width*tileSize;
      canvasArray = new Array(canvas.width/tileSize).fill(0).map(() => new Array(canvas.height/tileSize).fill("void"));
      json["tiles"].forEach((tile) => {
        let imgTag = tile.imgTag;
        let i = tile.i;
        let j = tile.j;
  
        if (imgTag == "void") {
          canvasArray[i][j] = "void";
        } else {
          let category = categories[imgTag[0]];
          console.log(category)
          let number = parseInt(imgTag.slice(1));
          canvasArray[i][j] = imgTag;
        }
      });
    };
    reader.readAsText(file);
    fileInput.value = "";
  });