define(['domReady!', 'text!templ/semantics.html'],
function(dom,         templSemantics            ) { 
	'use strict';
    $.Mustache.add('templ-semantics', templSemantics);
    var $semanticsContainer = $('.semantics-cointainer');
	$semanticsContainer.empty().mustache('templ-semantics', [
		{
			name: 'Stack1',
			fields: [],
			operations: [],
		}, 
		{
			name: 'Stack2',
			fields: [],
			operations: [],
		}, 
		{
			name: 'Stack3',
			fields: [],
			operations: [],
		}, 
		{
			name: 'Stack4',
			fields: [],
			operations: [],
		}, 
		{
			name: 'Stack5',
			fields: [],
			operations: [],
		}, 
	]);
	$semanticsContainer.on('click', '.jDelete', function() {
		$(this).closest('.type').remove();
	});
	$semanticsContainer.on('click', '.jRight', function() {
		var $thisType = $(this).closest('.type');
		$thisType.next().after($thisType);
	});
	$semanticsContainer.on('click', '.jLeft', function() {
		var $thisType = $(this).closest('.type');
		$thisType.prev().before($thisType);
	});
    return {};
}); 