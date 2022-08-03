(function($) {
    "use strict"; 

    $('.js-list-item').click(function(e){
      e.preventDefault()
      $('.js-list-item').removeClass('active');
      $(this).addClass('active');

      var name  = $(this).children().find('.js-name').html();
      var grade = $(this).find('.js-grade').html();
      $('.js-name-id').html(name);
      $('.js-grade-id').html(grade);
      console.log(name,grade)
    })

})(jQuery);    