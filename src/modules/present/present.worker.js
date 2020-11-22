import pptxgen from "pptxgenjs";
import { slide } from "svelte/types/runtime/transition";


class Slides {
  constructor(){
    this.decks = {};
    this.slides = {};
    this.layouts = {};
    this.warnings = [];
  }

  static slideOptions = [
    "deck", "masterSlide", "background", "color", "hidden", "slideNumber"
  ]

  static deckOptions = [
    "author", "company", "revision", "subject", "title", "layout", "rtlMode"
  ]

  static defaultLayouts = ["LAYOUT_16x9", "LAYOUT_16x10", "LAYOUT_4x3", "LAYOUT_WIDE"];

  checkOptions(subject, subjectName, options, supportedOptions){
    let difference = Object.keys(options)
      .filter(x => !supportedOptions.includes(x));
    for(diff of difference){
      this.warnings.push(
        `${subjectName}: ${subject} does not support option "${diff}"`
      );
    }
  }

  newSlide(slideName, options){
    this.checkOptions("Slide", slideName, options, this.slideOptions);
    this.slides[slideName] =  Object.assign({}, options);
  }

  newDeck(deckName, options){
    this.checkOptions("Deck", deckName, options, this.deckOptions);
    this.decks[deckName] = Object.assign({}, options);
  }

  addSlides(deckName, slideNames){
    this.decks[deckName] = this.decks[decksName] || {};
    this.decks[deckName].slides = slideNames;
  }

  hideSlide(slideName) {
    let slide = this.slides[slideName];
    if(slide){
      slide.hidden = true;
    } else {
      throw `Slide "${slideName}" is Undefined!`;
    }
  }

  defineLayout(options){
    if("name" in options && "width" in options && "height" in options){
      if(Number(options.height) != NaN && Number(options.width) != NaN){
        this.layouts[options.name] = {width: Number(options.width), height: Number(options.height)}
      } else {
        throw `height/width arguments are not Numbers`;
      }
    } else {
      throw `Missing key arguments`;
    }
  }

  buildDeck(deckName){
    let url = null;
    try {
      const pptx = this.compileDeck(deckName);
      pptx.write('blob')
        .then(
          blob => url = URL.createObjectURL(blob))
        .catch(
          err => this.warnings.push(`PptxGenJS Error: ${err.toString()}`)
        );
    } catch(error) {
      this.warnings.push(`Build Error for Deck "${deckName}": ${error.toString()}`);
    }
    return url;
  }

  compileDeck(deckName){
    const deck = Object.assign({}, this.decks[deckName]);
    const slides = deck.slides || [];
    delete deck.slides;
    const pptx = new  pptxgen();

    /* Copy options to pptx */
    Object.assign(pptx, deck);

    /* Compile and Add the slides to PPTX */
    for(slideName of slides){
      this.compileSlide(slideName, pptx);
    }

    /* Return the finished pptx */
    return pptx;
  }

  compileSlide()
}





function addChart(){}
function addImage(){
  
}
function addShape(){}
function addNotes(){}
function addTable(){}
function addText(){}
function addMedia(){}
function setLayout(){}
function defineSlideMaster(args){
  if (args.title){

  }
}
function setBackground(){}
function writeFile(){}


const actions = {
  "addPresentation": addPresentation,
  "addSlide": addSlide
}



onmessage = function(event){
  data = event.data;
  if(data.config){
    
  }
  postMessage()
}