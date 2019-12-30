
(function () {
  let generator = document.getElementsByTagName("meta").generator;  
  generator.name="keywords";
  generator.content="net,java,php,python,docker,web";
  let meta = document.createElement("meta");
  let s = document.getElementsByTagName("meta")[0];
  meta.name="google-site-verification";
  meta.content="le9TAKnSKhLDEEGnDu2ofXi3taLVIxmKNT0bEIsetNE";
  s.parentNode.insertBefore(meta, s);
  let copyright = document.getElementsByClassName("md-footer-copyright")
  copyright[0].outerHTML=document.getElementsByClassName("md-footer-copyright__highlight")[0].outerHTML
})();
