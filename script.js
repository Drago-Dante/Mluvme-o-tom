document.addEventListener("DOMContentLoaded", function () { //cely se to spusti az po nacteni stranky

  let seznamAnimate = document.querySelectorAll("[class*='animate__']");  //vezme vsechny prvky, ktere maji tridu obsahujici animate__ a potom se da do pole
  let poleAnimate = Array.prototype.slice.call(seznamAnimate);

  for (let i = 0; i < poleAnimate.length; i++) {
    let prvek = poleAnimate[i];

    let vsechnyTridy = Array.prototype.slice.call(prvek.classList); //vezme vsechny tridy daneho prvku a da je do pole
    let animaceTridy = [];
    for (let j = 0; j < vsechnyTridy.length; j++) {
      let trida = vsechnyTridy[j];
      if (trida.indexOf("animate__") === 0) {
        animaceTridy.push(trida); //ulozi se trida do pole animaceTridy
      }
    }

    if (animaceTridy.length > 0) {
      prvek.setAttribute("data-animaceTridy", animaceTridy.join(" ")); //ty puvodni animace se ulozi do toho atributu a deli se mezerama, aby se pak mohly pridat zpet

      for (let k = 0; k < animaceTridy.length; k++) {
        prvek.classList.remove(animaceTridy[k]); //odstrani se puvodni animacni trida, aby se animace nespustila hned
      }

      prvek.classList.add("animace-skryta"); //prida se trida animace-skryta aby to na zacatku bylo skryte, je to tam protoze se to jinak ze zacatku glitchuje
    }
  }

  let pozorovani = new IntersectionObserver(function (zaznamyStavu, pozor) { //funkce se spusti, kdyz se neco zmeni ve viditelnosti pozorovanych prvku
    for (let e = 0; e < zaznamyStavu.length; e++) {
      let zaznamStavu = zaznamyStavu[e];
      if (zaznamStavu.isIntersecting) {
        let animTridy = zaznamStavu.target.getAttribute("data-animaceTridy");
        if (animTridy) {
          zaznamStavu.target.classList.remove("animace-skryta"); //animace-skryta trida se odstrani, aby se prvek zobrazil

          void zaznamStavu.target.offsetWidth; //vynuti stranku aby se provedla reflow a animace se spustila spravne (nemusi to tam byt ale bez toho to nekdy nefunguje)

          let casti = animTridy.split(" "); //radsi se me neptejte
          for (let p = 0; p < casti.length; p++) { 
            zaznamStavu.target.classList.add(casti[p]); //prida se zpet puvodni animacni trida, cimz se spusti animace
          }
        }

        pozor.unobserve(zaznamStavu.target); //prvek se prestane pozorovat, protoze uz animace probehla
      }
    }
  }, { threshold: 0.2 }); //tohle urcuje kolik procent tech prvku musi byt viditelnych, aby se animace spustila

  for (let o = 0; o < poleAnimate.length; o++) {
    let prvekPozorovani = poleAnimate[o];
    if (prvekPozorovani.getAttribute && prvekPozorovani.getAttribute("data-animaceTridy")) { //pozorujeme jen ty prvky, ktere maji ten atribut
      pozorovani.observe(prvekPozorovani); //zacne se pozorovat prvek
    }
  }
});
