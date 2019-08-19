window.onload = function() {
    var converter = new showdown.Converter();
    var pad = document.getElementById("editor");
    var markdownArea = document.getElementById("markdown");
    var hiddenTextArea = document.getElementById("hiddenTextArea");

    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
        hiddenTextArea.innerHTML = html;
    };

    pad.addEventListener('input', convertTextAreaToMarkdown);

    convertTextAreaToMarkdown();
};
