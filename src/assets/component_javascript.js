$(document).ready(()=>{
    // alert("Javacri\pt Initialized");
    $(".dropdown-trigger").dropdown({
      hover:true
    });
    $('.parallax').parallax();
    $('.carousel').carousel();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true
      });
      $('.tooltipped').tooltip();

      // Fix for focus on the input when the label is clicked
      let inputLabels = document.querySelectorAll('label');
      for(let x = 0 ; x < inputLabels.length ; x++){
        inputLabels[x].addEventListener("click",()=>{
          
          inputLabels[x].classList += "active";
          if(inputLabels[x].previousElementSibling!=null){
          inputLabels[x].previousElementSibling.focus();
          }
        })
      }



});

$(document).ready(function() {
  $("#myCarousel").on("slide.bs.carousel", function(e) {
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 3;
    var totalItems = $(".carousel-item").length;

    if (idx >= totalItems - (itemsPerSlide - 1)) {
      
      var it = itemsPerSlide - (totalItems - idx);
      for (var i = 0; i < it; i++) {
        // append slides to end
        if (e.direction == "left") {
          $(".carousel-item")
            .eq(i)
            .appendTo(".carousel-inner");
        } else {
          $(".carousel-item")
            .eq(0)
            .appendTo($(this).find(".carousel-inner"));
        }
      }
    }
  });
});


