// jshint ignore: start
(function ($, Drupal) {
  Drupal.behaviors.pel = {
    attach: function (context, settings) {
      /////////////////

      $('#pel-builder').once('pel').each(function (e) {
        new LayoutBuilderWrapper(this, settings.nppe_pel.layout);

        console.log('llega')
        console.log(settings.nppe_pel.layout)

        this.addEventListener('layout.save', function (e) {
          console.log('Sale')
          console.log(e.detail.jsonLayout)

          const data = {
            layout: e.detail.jsonLayout
          };

          $.post(settings.nppe_pel.path, data)
            .done(function () {
              location.reload();
            })
            .fail(function () {
              // @todo catch this and show to the user.
              console.error('The node does not exist.');
            });
        });

      });

      /////////////////
    }
  };

})(jQuery, Drupal);
