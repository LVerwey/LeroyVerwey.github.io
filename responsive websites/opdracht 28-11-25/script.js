  
  //document.querySelector voor 1 element zoals h1

  toonBericht("dit is de parameter")

  const header = document.getElementById("headerTekst");
  
  const input = document.getElementById("tekstVeld");
  
  const button = document.getElementById("btn");


  button.addEventListener("click", function() {
    header.textContent = "Welkom " + input.value;
    console.log(input.value); 
    });


     function toonBericht(hetBericht)
{
    alert(hetBericht);
}

  const knop = document.getElementById("veranderknop");
  const titel = document.getElementById("titel");
  const tekst = document.getElementById("tekst");
  let oudeTxt = 0;

  knop.addEventListener ("click", function()
  {
      titel.textContent= "een nieuwe tekst";

      titel.style.color="blue"
      titel.style.fontSize="70px"
  });

  

  //Event 1: mouse hover -> tekst wordt rood
  tekst.addEventListener("mouseover", function(){
    tekst.style.color = "red";  
  })

//Event 2 mouseout -> kleur zwart
  tekst.addEventListener("mouseout", function(){
    tekst.style.color = "black";
  })

//Event 3 click -> tekst verandert
  tekst.addEventListener("click", function(){
    if(oudeTxt == 1)
    {
      oudeTxt = 0;
       
      tekst.textContent = "oooooh you touched me!";
    }
    else
    {
        tekst.textContent = "Beweeg over mij of klik mij!";

        oudeTxt = 1;
    }

  })

  