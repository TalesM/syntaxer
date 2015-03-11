define(['domReady!', 'text!templ/semantic.html'],
function(dom,         templSemantic            ) {
    $.Mustache.add('templ-semantic', templSemantic);
	$('.semantics-cointainer').empty().mustache('templ-semantic', [{}, {}, {}, {}, {}]);
    return {};
}); 