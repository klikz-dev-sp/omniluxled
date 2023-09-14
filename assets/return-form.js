$(document).ready(function () {
  $(document).on(
    'change',
    "input[name='radio-1'], input[name='radio-2'], input[data-type='datetime'], input[name='checkbox-1[]']",
    function () {
      let method = $("input[name='radio-1']:checked").val();
      let direct = $("input[name='radio-2']:checked").val();
      let date = $("input[data-type='datetime']").val();

      let orderDate = new Date(date);
      let warrantyDate = new Date();
      warrantyDate.setFullYear(warrantyDate.getFullYear() - 2);

      let products = Array.from($("input[name='checkbox-1[]']:checked"));
      let skincare = false;

      if (method == 'Return' && direct == 'No') {
        $('.alert.no-return').parent().show();
        $('.wizard__submit').prop('disabled', true);
      } else {
        $('.alert.no-return').parent().hide();
        $('.wizard__submit').prop('disabled', false);
      }

      if (method == 'Replace' && direct == 'No') {
        $('.alert.verify-receipt').parent().show();
        $("input[placeholder='Business Name']").parent().parent().show();
        $("input[placeholder='Business Name']").prop('disabled', false);
        $("input[placeholder='Order Number']").parent().parent().hide();
        $("input[placeholder='Order Number']").prop('disabled', true);
        $("input[placeholder='Proof of Purchase (for Replacement item)']")
          .parent()
          .parent()
          .show();
      } else {
        $('.alert.verify-receipt').parent().hide();
        $("input[placeholder='Business Name']").parent().parent().hide();
        $("input[placeholder='Business Name']").prop('disabled', true);
        $("input[placeholder='Order Number']").parent().parent().show();
        $("input[placeholder='Order Number']").prop('disabled', false);
        $("input[placeholder='Proof of Purchase (for Replacement item)']")
          .parent()
          .parent()
          .hide();
      }

      if (method == 'Replace' && orderDate < warrantyDate) {
        $('.alert.warranty').parent().show();
      } else {
        $('.alert.warranty').parent().hide();
      }

      products.forEach((product) => {
        if (
          $(product).val() == 'LED Essentials Bundle' ||
          $(product).val() == 'Enzyme Powder Cleanser' ||
          $(product).val() == 'Hyaluronic Acid Serum' ||
          $(product).val() == 'Peptide Concentrate' ||
          $(product).val() == 'Omnilux Hydrogel Facial Mask' ||
          $(product).val() == 'Omnilux Hydrogel Décolleté Mask'
        ) {
          skincare = true;
        }
      });

      if (method == 'Return' && skincare == true) {
        $('.alert.topical').parent().show();
      } else {
        $('.alert.topical').parent().hide();
      }

      // Country Code
      let country_code = $('#country_code').val();

      if (country_code) {
        $('#hidden-1').val(country_code);
      }
    }
  );
});
