define(['lib/SyntaxParser', 'jquery.mustache', 'lib/DomParser', 'lib/TextGenerator', 'lib/TemplGenerator', 'util/utility', 'text!templ/model.syntax', 'domReady!'], 
function(syntaxParser,       jqueryMustache ,   domParser,       TextGenerator,       TemplGenerator,       utility ,       modelSyntax ,                    doc) {
	'use strict'
    var foundTokens = {};
    var templGenerator = new TemplGenerator(foundTokens);
    var textGenerator = new TextGenerator(foundTokens);
    
    /**
     * Refresh extra tokens on GUI
     * @return {undefined}
     */
    function refreshExtraTokens(){
        var $extraTokens = $('.extra-tokens').empty();
        for(var token in foundTokens){
            if(document.getElementById('rule-'+token) || foundTokens[token] <= 0){
                continue;
            }
            $extraTokens.append('<span id="rule-'+token+'">'+token+'</span>');
        }
    }

    /**
     * Return the rule's class name.
     * @param  {jQuery}
     * @return {String} The class name.
     */
    function getRuleClass($button){
        return '.' + $button.closest('.rule').attr('id');
    }

    $('#definition').on('click', '.jAdd', function(){
        var even = true;
        var bruteText = $('#input').val().trim();
        if(!bruteText)
            return;
        var rules = syntaxParser.parse(bruteText, templGenerator);
        $('.buttons').show();
        if($(this).is('.jAll')){
            $('#definition').mustache('definition', {rules:rules}, { method: 'html' });
        }else {
            $('.output').mustache('syntax', rules);
        }
        utility.resizeTextArea($('#input').val(''));
        refreshExtraTokens();
    });
    $('#definition').on('click', '.jEditAll', function(){
        var spaces = 0;
        $('#definition .rule .name').each(function(){
            var length =$(this).text().trim().length;
            if(length >= spaces){
                spaces = length + 1;
            }
        });

        textGenerator.spaces(spaces);
        var input = domParser.parse($('#definition'), textGenerator);
        $('#definition').mustache('definition', {text:input}, { method: 'html' });
        utility.resizeTextArea($('#input'));
    });
    $('#definition').on('click', '.jToogle', function(){
        $('.semantic').toggle();
    });
    $('#definition').on('click', '.jUp', function(){
        var $currentHead = $(this).closest('.rule');
        var $current = $(getRuleClass($currentHead));
        var $prevHead = $currentHead.prevAll('.head').first();
        var $prev = $(getRuleClass($prevHead));
        $prev.toggleClass('even');
        $current.toggleClass('even');
        $current.each(function(){
            $prevHead.before($(this));
        });
    });

    $('#definition').on('click', '.jDown', function(){
        var $currentHead = $(this).closest('.rule');
        var $current = $(getRuleClass($currentHead));
        var $nextHead = $currentHead.nextAll('.head').first();
        var $next = $(getRuleClass($nextHead));
        $next.toggleClass('even');
        $current.toggleClass('even');
        $next.each(function(){
            $currentHead.before($(this));
        });
    });

    $('#definition').on('click', '.jEdit', function(){
        var className = getRuleClass($(this));
        var $current = $(className);
        var newVal;

        var isProduction = $current.is('.production');
        if(isProduction){
            var arrayVals = [];
            $current.each(function(){
                arrayVals.push(domParser.parseDefinition($(this), textGenerator));
            });
            newVal = arrayVals.join('\n');
        } else {
            console.log($current)
            console.log($current.closest('.rule'));
            console.log($current.closest('.rule').find('.regex'));
            newVal = domParser.parseToken($current.closest('.rule').find('.regex'), textGenerator);
        }
        
        var $currentHead = $current.first();
        $currentHead.children(':not(.name)').remove();
        $currentHead.mustache('templ-edit', {
            production:isProduction,
            value:newVal
        });
        $currentHead.data('even', $current.hasClass('even'))
                    .data('production', isProduction);
        $current.not($currentHead).remove();

        utility.resizeTextArea($currentHead.find('textarea'));
    });
    $('#definition').on('click', '.jDelete', function(){
        var $this = $(getRuleClass($(this)));
        $this.find('.def-item').each(function () {
            domParser.parseToken($(this), textGenerator);
        })
        $this.nextAll().toggleClass('even');
        $this.remove();
        refreshExtraTokens();
    });

    $('#definition').on('click', '.jResetEdit', function(){
        var $value = $(this).closest('.rule').find('.value');
        $value.val($value.text());
    });
    $('#definition').on('click', '.jOkEdit', function(){
        var $editRule = $(this).closest('.rule');
        var $value = $editRule.find('.value');
        var newVal = $value.val().trim();
        var name = $editRule.find('.name').text().trim();
        var rules;
        if($editRule.data('production')){
            rules = newVal.split('\n').map(function(v){
                return v.trim();
            }).filter(function(cline){
                if(!cline.trim() || cline[0]==='#'){
                    return false;
                }
                return true;
            }).map(function(ruleDef, i){
                return {
                    ruleName: name,
                    ruleId: name.toLowerCase(),
                    even: $editRule.data('even'),
                    newRule: i==0,
                    ruleDef: syntaxParser.parseDefinition(ruleDef, templGenerator),
                    classes: 'production'
                };
            });
        } else if(name === '<whitespace>') {
            rules = [{
                ruleName: '<whitespace>',
                ruleId: '_whitespace_',
                even: $editRule.data('even'),
                newRule: true,
                ruleDef: [syntaxParser.parseToken(newVal, templGenerator)],
                classes: 'terminal'
            }];
        } else {

            rules = [{
                ruleName: name,
                ruleId: name.toLowerCase(),
                even: $editRule.data('even'),
                newRule: true,
                ruleDef: [syntaxParser.parseToken(newVal, templGenerator)],
                classes: 'terminal'
            }];
        }
        
        if(rules.length){
            $editRule.mustache('syntax', rules, { method: 'before' });
        } else {
            $editRule.nextAll().toggleClass('even');
        }
        $editRule.remove();
        refreshExtraTokens();
    });
    $('body').on('input', 'textarea', function(){
        var $this = $(this);
        utility.resizeTextArea($this);
    });


    ////////////
    //Loading //
    ////////////
    $('#definition').mustache('definition', {text: $('#input').val()||modelSyntax}, { method: 'html' });
    utility.resizeTextArea($('#input'));
})