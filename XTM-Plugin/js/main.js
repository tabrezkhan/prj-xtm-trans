var contentSource = "";  //store content of the object
var titleSource = "";    // store title of the object

// add new revision of the particular object
addRevision = () => {


  let apiKey = getParameterByName('write_key');                   // Bucket write key
  let bucket_slug = getParameterByName('bucket_slug');            // slug - Unique identifier of the Object
  let object_slug = getParameterByName('object_slug');
  /** */
  let type = getParameterByName('type');
  let targetLang = $("#targetLang").val();

  $.ajax({
    url: "https://api.cosmicjs.com/v1/" + bucket_slug + "/add-object",
    type: "POST",
    data: {

      "type_slug": type,
      "title": titleSource,
      "locale": targetLang,
      "content": $("#outputContent").val(),
      "slug": object_slug,
      "write_key": apiKey
    },
    success: function (result) {

      toastr.success(object_slug + ' Updated!');




    }
  });

}


translateText = (contents) => {


  let apiKey = "AIzaSyAC5JVm64iQB047Scs4cK4V4PYbcW7b9Kc";
  let sourceLang = $("#sourceLang").val();
  let targetLang = $("#targetLang").val();
  let content = contents || $("#content").val();//

  $.ajax({
    url: "https://translation.googleapis.com/language/translate/v2?key=" + apiKey,
    type: "POST",
    data: {
      "q": content,
      "source": sourceLang,
      "target": targetLang,
      "format": "text"
    },
    success: function (result) {
      toastr.success('Information', 'Success!');

      if (result.data.translations && result.data.translations[0] && result.data.translations[0].translatedText) {
        $("#outputContent").val(result.data.translations[0].translatedText);
      }
      addRevision();


    }
  });




}

fetchObjectData = () => {


  let apiKey = getParameterByName('read_key');
  let bucket_slug = getParameterByName('bucket_slug');
  let object_slug = getParameterByName('object_slug');

 
  $.ajax({
    url: "https://api.cosmicjs.com/v1/" + bucket_slug + "/object/" + object_slug + "?pretty=true&hide_metafields=true&read_key=" + apiKey + "&props=slug,title,content,metadata",
    type: "GET",
    success: function (result) {

      toastr.success(object_slug + ' Fetched!');

      if (result.object.content) {
        $("#content").val(result.object.content.replace(/<[^>]*>/g, ''));
      }


  
      titleSource = result.object.title;
      contentSource = result.object.content;


    }
  });

}


updateText = () => {

  let apiKey = getParameterByName('write_key');
  let bucket_slug = getParameterByName('bucket_slug');
  let object_slug = getParameterByName('object_slug');


  $.ajax({
    url: "https://api.cosmicjs.com/v1/" + bucket_slug + "/add-object",
    type: "PUT",
    data: {
      "slug": object_slug,
      "content": $("#outputContent").val(),
      "write_key": apiKey
    },
    success: function (result) {

      toastr.success(object_slug + ' Updated!');




    }
  });

}

fetchObjectData();

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}