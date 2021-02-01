 /*
 * # Fomantic UI - 2.7.6
 * https://github.com/fomantic/Fomantic-UI
 * http://fomantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
/*!
 * # Fomantic-UI - Site
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

$.isFunction = $.isFunction || function(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
};

$.site = $.fn.site = function(parameters) {
  var
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.site.settings, parameters)
      : $.extend({}, $.site.settings),

    namespace       = settings.namespace,
    error           = settings.error,

    moduleNamespace = 'module-' + namespace,

    $document       = $(document),
    $module         = $document,
    element         = this,
    instance        = $module.data(moduleNamespace),

    module,
    returnedValue
  ;
  module = {

    initialize: function() {
      module.instantiate();
    },

    instantiate: function() {
      module.verbose('Storing instance of site', module);
      instance = module;
      $module
        .data(moduleNamespace, module)
      ;
    },

    normalize: function() {
      module.fix.console();
      module.fix.requestAnimationFrame();
    },

    fix: {
      console: function() {
        module.debug('Normalizing window.console');
        if (console === undefined || console.log === undefined) {
          module.verbose('Console not available, normalizing events');
          module.disable.console();
        }
        if (typeof console.group == 'undefined' || typeof console.groupEnd == 'undefined' || typeof console.groupCollapsed == 'undefined') {
          module.verbose('Console group not available, normalizing events');
          window.console.group = function() {};
          window.console.groupEnd = function() {};
          window.console.groupCollapsed = function() {};
        }
        if (typeof console.markTimeline == 'undefined') {
          module.verbose('Mark timeline not available, normalizing events');
          window.console.markTimeline = function() {};
        }
      },
      consoleClear: function() {
        module.debug('Disabling programmatic console clearing');
        window.console.clear = function() {};
      },
      requestAnimationFrame: function() {
        module.debug('Normalizing requestAnimationFrame');
        if(window.requestAnimationFrame === undefined) {
          module.debug('RequestAnimationFrame not available, normalizing event');
          window.requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); }
          ;
        }
      }
    },

    moduleExists: function(name) {
      return ($.fn[name] !== undefined && $.fn[name].settings !== undefined);
    },

    enabled: {
      modules: function(modules) {
        var
          enabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(module.moduleExists(name)) {
            enabledModules.push(name);
          }
        });
        return enabledModules;
      }
    },

    disabled: {
      modules: function(modules) {
        var
          disabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(!module.moduleExists(name)) {
            disabledModules.push(name);
          }
        });
        return disabledModules;
      }
    },

    change: {
      setting: function(setting, value, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? (modules === 'all')
            ? settings.modules
            : [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            namespace = (module.moduleExists(name))
              ? $.fn[name].settings.namespace || false
              : true,
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', setting, value, name);
            $.fn[name].settings[setting] = value;
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', setting, value);
              }
            }
          }
        });
      },
      settings: function(newSettings, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', newSettings, name);
            $.extend(true, $.fn[name].settings, newSettings);
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', newSettings);
              }
            }
          }
        });
      }
    },

    enable: {
      console: function() {
        module.console(true);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling debug for modules', modules);
        module.change.setting('debug', true, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling verbose debug for modules', modules);
        module.change.setting('verbose', true, modules, modifyExisting);
      }
    },
    disable: {
      console: function() {
        module.console(false);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling debug for modules', modules);
        module.change.setting('debug', false, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling verbose debug for modules', modules);
        module.change.setting('verbose', false, modules, modifyExisting);
      }
    },

    console: function(enable) {
      if(enable) {
        if(instance.cache.console === undefined) {
          module.error(error.console);
          return;
        }
        module.debug('Restoring console function');
        window.console = instance.cache.console;
      }
      else {
        module.debug('Disabling console function');
        instance.cache.console = window.console;
        window.console = {
          clear          : function(){},
          error          : function(){},
          group          : function(){},
          groupCollapsed : function(){},
          groupEnd       : function(){},
          info           : function(){},
          log            : function(){},
          markTimeline   : function(){},
          warn           : function(){}
        };
      }
    },

    destroy: function() {
      module.verbose('Destroying previous site for', $module);
      $module
        .removeData(moduleNamespace)
      ;
    },

    cache: {},

    setting: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, settings, name);
      }
      else if(value !== undefined) {
        settings[name] = value;
      }
      else {
        return settings[name];
      }
    },
    internal: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, module, name);
      }
      else if(value !== undefined) {
        module[name] = value;
      }
      else {
        return module[name];
      }
    },
    debug: function() {
      if(settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.debug.apply(console, arguments);
        }
      }
    },
    verbose: function() {
      if(settings.verbose && settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.verbose.apply(console, arguments);
        }
      }
    },
    error: function() {
      module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
      module.error.apply(console, arguments);
    },
    performance: {
      log: function(message) {
        var
          currentTime,
          executionTime,
          previousTime
        ;
        if(settings.performance) {
          currentTime   = new Date().getTime();
          previousTime  = time || currentTime;
          executionTime = currentTime - previousTime;
          time          = currentTime;
          performance.push({
            'Element'        : element,
            'Name'           : message[0],
            'Arguments'      : [].slice.call(message, 1) || '',
            'Execution Time' : executionTime
          });
        }
        clearTimeout(module.performance.timer);
        module.performance.timer = setTimeout(module.performance.display, 500);
      },
      display: function() {
        var
          title = settings.name + ':',
          totalTime = 0
        ;
        time = false;
        clearTimeout(module.performance.timer);
        $.each(performance, function(index, data) {
          totalTime += data['Execution Time'];
        });
        title += ' ' + totalTime + 'ms';
        if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
          console.groupCollapsed(title);
          if(console.table) {
            console.table(performance);
          }
          else {
            $.each(performance, function(index, data) {
              console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
            });
          }
          console.groupEnd();
        }
        performance = [];
      }
    },
    invoke: function(query, passedArguments, context) {
      var
        object = instance,
        maxDepth,
        found,
        response
      ;
      passedArguments = passedArguments || queryArguments;
      context         = element         || context;
      if(typeof query == 'string' && object !== undefined) {
        query    = query.split(/[\. ]/);
        maxDepth = query.length - 1;
        $.each(query, function(depth, value) {
          var camelCaseValue = (depth != maxDepth)
            ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
            : query
          ;
          if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
            object = object[camelCaseValue];
          }
          else if( object[camelCaseValue] !== undefined ) {
            found = object[camelCaseValue];
            return false;
          }
          else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
            object = object[value];
          }
          else if( object[value] !== undefined ) {
            found = object[value];
            return false;
          }
          else {
            module.error(error.method, query);
            return false;
          }
        });
      }
      if ( $.isFunction( found ) ) {
        response = found.apply(context, passedArguments);
      }
      else if(found !== undefined) {
        response = found;
      }
      if(Array.isArray(returnedValue)) {
        returnedValue.push(response);
      }
      else if(returnedValue !== undefined) {
        returnedValue = [returnedValue, response];
      }
      else if(response !== undefined) {
        returnedValue = response;
      }
      return found;
    }
  };

  if(methodInvoked) {
    if(instance === undefined) {
      module.initialize();
    }
    module.invoke(query);
  }
  else {
    if(instance !== undefined) {
      module.destroy();
    }
    module.initialize();
  }
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.site.settings = {

  name        : 'Site',
  namespace   : 'site',

  error : {
    console : 'Console cannot be restored, most likely it was overwritten outside of module',
    method : 'The method you called is not defined.'
  },

  debug       : false,
  verbose     : false,
  performance : true,

  modules: [
    'accordion',
    'api',
    'calendar',
    'checkbox',
    'dimmer',
    'dropdown',
    'embed',
    'form',
    'modal',
    'nag',
    'popup',
    'slider',
    'rating',
    'shape',
    'sidebar',
    'state',
    'sticky',
    'tab',
    'toast',
    'transition',
    'visibility',
    'visit'
  ],

  siteNamespace   : 'site',
  namespaceStub   : {
    cache     : {},
    config    : {},
    sections  : {},
    section   : {},
    utilities : {}
  }

};

// allows for selection of elements with data attributes
$.extend($.expr[ ":" ], {
  data: ($.expr.createPseudo)
    ? $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      })
    : function(elem, i, match) {
      // support: jQuery < 1.8
      return !!$.data(elem, match[ 3 ]);
    }
});


})( jQuery, window, document );

/*!
 * # Fomantic-UI - Form Validation
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.form = function(parameters) {
  var
    $allModules      = $(this),
    moduleSelector   = $allModules.selector || '',

    time             = new Date().getTime(),
    performance      = [],

    query            = arguments[0],
    legacyParameters = arguments[1],
    methodInvoked    = (typeof query == 'string'),
    queryArguments   = [].slice.call(arguments, 1),
    returnedValue
  ;
  $allModules
    .each(function() {
      var
        $module     = $(this),
        element     = this,

        formErrors  = [],
        keyHeldDown = false,

        // set at run-time
        $field,
        $group,
        $message,
        $prompt,
        $submit,
        $clear,
        $reset,

        settings,
        validation,

        metadata,
        selector,
        className,
        regExp,
        error,

        namespace,
        moduleNamespace,
        eventNamespace,

        submitting = false,
        dirty = false,
        history = ['clean', 'clean'],

        instance,
        module
      ;

      module      = {

        initialize: function() {

          // settings grabbed at run time
          module.get.settings();
          if(methodInvoked) {
            if(instance === undefined) {
              module.instantiate();
            }
            module.invoke(query);
          }
          else {
            if(instance !== undefined) {
              instance.invoke('destroy');
            }
            module.verbose('Initializing form validation', $module, settings);
            module.bindEvents();
            module.set.defaults();
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', instance);
          module.removeEvents();
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing selector cache');
          $field      = $module.find(selector.field);
          $group      = $module.find(selector.group);
          $message    = $module.find(selector.message);
          $prompt     = $module.find(selector.prompt);

          $submit     = $module.find(selector.submit);
          $clear      = $module.find(selector.clear);
          $reset      = $module.find(selector.reset);
        },

        submit: function() {
          module.verbose('Submitting form', $module);
          submitting = true;
          $module.submit();
        },

        attachEvents: function(selector, action) {
          action = action || 'submit';
          $(selector).on('click' + eventNamespace, function(event) {
            module[action]();
            event.preventDefault();
          });
        },

        bindEvents: function() {
          module.verbose('Attaching form events');
          $module
            .on('submit' + eventNamespace, module.validate.form)
            .on('blur'   + eventNamespace, selector.field, module.event.field.blur)
            .on('click'  + eventNamespace, selector.submit, module.submit)
            .on('click'  + eventNamespace, selector.reset, module.reset)
            .on('click'  + eventNamespace, selector.clear, module.clear)
          ;
          if(settings.keyboardShortcuts) {
            $module.on('keydown' + eventNamespace, selector.field, module.event.field.keydown);
          }
          $field.each(function(index, el) {
            var
              $input     = $(el),
              type       = $input.prop('type'),
              inputEvent = module.get.changeEvent(type, $input)
            ;
            $input.on(inputEvent + eventNamespace, module.event.field.change);
          });

          // Dirty events
          if (settings.preventLeaving) {
            $(window).on('beforeunload' + eventNamespace, module.event.beforeUnload);
          }

          $field.on('change click keyup keydown blur', function(e) {
            $(this).trigger(e.type + ".dirty");
          });

          $field.on('change.dirty click.dirty keyup.dirty keydown.dirty blur.dirty', module.determine.isDirty);

          $module.on('dirty' + eventNamespace, function(e) {
            settings.onDirty.call();
          });

          $module.on('clean' + eventNamespace, function(e) {
            settings.onClean.call();
          })
        },

        clear: function() {
          $field.each(function (index, el) {
            var
              $field       = $(el),
              $element     = $field.parent(),
              $fieldGroup  = $field.closest($group),
              $prompt      = $fieldGroup.find(selector.prompt),
              $calendar    = $field.closest(selector.uiCalendar),
              defaultValue = $field.data(metadata.defaultValue) || '',
              isCheckbox   = $element.is(selector.uiCheckbox),
              isDropdown   = $element.is(selector.uiDropdown),
              isCalendar   = ($calendar.length > 0),
              isErrored    = $fieldGroup.hasClass(className.error)
            ;
            if(isErrored) {
              module.verbose('Resetting error on field', $fieldGroup);
              $fieldGroup.removeClass(className.error);
              $prompt.remove();
            }
            if(isDropdown) {
              module.verbose('Resetting dropdown value', $element, defaultValue);
              $element.dropdown('clear');
            }
            else if(isCheckbox) {
              $field.prop('checked', false);
            }
            else if (isCalendar) {
              $calendar.calendar('clear');
            }
            else {
              module.verbose('Resetting field value', $field, defaultValue);
              $field.val('');
            }
          });
        },

        reset: function() {
          $field.each(function (index, el) {
            var
              $field       = $(el),
              $element     = $field.parent(),
              $fieldGroup  = $field.closest($group),
              $calendar    = $field.closest(selector.uiCalendar),
              $prompt      = $fieldGroup.find(selector.prompt),
              defaultValue = $field.data(metadata.defaultValue),
              isCheckbox   = $element.is(selector.uiCheckbox),
              isDropdown   = $element.is(selector.uiDropdown),
              isCalendar   = ($calendar.length > 0),
              isErrored    = $fieldGroup.hasClass(className.error)
            ;
            if(defaultValue === undefined) {
              return;
            }
            if(isErrored) {
              module.verbose('Resetting error on field', $fieldGroup);
              $fieldGroup.removeClass(className.error);
              $prompt.remove();
            }
            if(isDropdown) {
              module.verbose('Resetting dropdown value', $element, defaultValue);
              $element.dropdown('restore defaults');
            }
            else if(isCheckbox) {
              module.verbose('Resetting checkbox value', $element, defaultValue);
              $field.prop('checked', defaultValue);
            }
            else if (isCalendar) {
              $calendar.calendar('set date', defaultValue);
            }
            else {
              module.verbose('Resetting field value', $field, defaultValue);
              $field.val(defaultValue);
            }
          });

          module.determine.isDirty();
        },

        determine: {
          isValid: function() {
            var
              allValid = true
            ;
            $.each(validation, function(fieldName, field) {
              if( !( module.validate.field(field, fieldName, true) ) ) {
                allValid = false;
              }
            });
            return allValid;
          },
          isDirty: function(e) {
            var formIsDirty = false;

            $field.each(function(index, el) {
              var
                $el = $(el),
                isCheckbox = ($el.filter(selector.checkbox).length > 0),
                isDirty
              ;

              if (isCheckbox) {
                isDirty = module.is.checkboxDirty($el);
              } else {
                isDirty = module.is.fieldDirty($el);
              }

              $el.data(settings.metadata.isDirty, isDirty);

              formIsDirty |= isDirty;
            });

            if (formIsDirty) {
              module.set.dirty();
            } else {
              module.set.clean();
            }

            if (e && e.namespace === 'dirty') {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
          }
        },

        is: {
          bracketedRule: function(rule) {
            return (rule.type && rule.type.match(settings.regExp.bracket));
          },
          shorthandFields: function(fields) {
            var
              fieldKeys = Object.keys(fields),
              firstRule = fields[fieldKeys[0]]
            ;
            return module.is.shorthandRules(firstRule);
          },
          // duck type rule test
          shorthandRules: function(rules) {
            return (typeof rules == 'string' || Array.isArray(rules));
          },
          empty: function($field) {
            if(!$field || $field.length === 0) {
              return true;
            }
            else if($field.is(selector.checkbox)) {
              return !$field.is(':checked');
            }
            else {
              return module.is.blank($field);
            }
          },
          blank: function($field) {
            return $.trim($field.val()) === '';
          },
          valid: function(field) {
            var
              allValid = true
            ;
            if(field) {
              module.verbose('Checking if field is valid', field);
              return module.validate.field(validation[field], field, false);
            }
            else {
              module.verbose('Checking if form is valid');
              $.each(validation, function(fieldName, field) {
                if( !module.is.valid(fieldName) ) {
                  allValid = false;
                }
              });
              return allValid;
            }
          },
          dirty: function() {
            return dirty;
          },
          clean: function() {
            return !dirty;
          },
          fieldDirty: function($el) {
            var initialValue = $el.data(metadata.defaultValue);
            // Explicitly check for null/undefined here as value may be `false`, so ($el.data(dataInitialValue) || '') would not work
            if (initialValue == null) { initialValue = ''; }
            var currentValue = $el.val();
            if (currentValue == null) { currentValue = ''; }

            // Boolean values can be encoded as "true/false" or "True/False" depending on underlying frameworks so we need a case insensitive comparison
            var boolRegex = /^(true|false)$/i;
            var isBoolValue = boolRegex.test(initialValue) && boolRegex.test(currentValue);
            if (isBoolValue) {
              var regex = new RegExp("^" + initialValue + "$", "i");
              return !regex.test(currentValue);
            }

            return currentValue !== initialValue;
          },
          checkboxDirty: function($el) {
            var initialValue = $el.data(metadata.defaultValue);
            var currentValue = $el.is(":checked");

            return initialValue !== currentValue;
          },
          justDirty: function() {
            return (history[0] === 'dirty');
          },
          justClean: function() {
            return (history[0] === 'clean');
          }
        },

        removeEvents: function() {
          $module.off(eventNamespace);
          $field.off(eventNamespace);
          $submit.off(eventNamespace);
          $field.off(eventNamespace);
        },

        event: {
          field: {
            keydown: function(event) {
              var
                $field       = $(this),
                key          = event.which,
                isInput      = $field.is(selector.input),
                isCheckbox   = $field.is(selector.checkbox),
                isInDropdown = ($field.closest(selector.uiDropdown).length > 0),
                keyCode      = {
                  enter  : 13,
                  escape : 27
                }
              ;
              if( key == keyCode.escape) {
                module.verbose('Escape key pressed blurring field');
                $field
                  .blur()
                ;
              }
              if(!event.ctrlKey && key == keyCode.enter && isInput && !isInDropdown && !isCheckbox) {
                if(!keyHeldDown) {
                  $field.one('keyup' + eventNamespace, module.event.field.keyup);
                  module.submit();
                  module.debug('Enter pressed on input submitting form');
                }
                keyHeldDown = true;
              }
            },
            keyup: function() {
              keyHeldDown = false;
            },
            blur: function(event) {
              var
                $field          = $(this),
                $fieldGroup     = $field.closest($group),
                validationRules = module.get.validation($field)
              ;
              if( $fieldGroup.hasClass(className.error) ) {
                module.debug('Revalidating field', $field, validationRules);
                if(validationRules) {
                  module.validate.field( validationRules );
                }
              }
              else if(settings.on == 'blur') {
                if(validationRules) {
                  module.validate.field( validationRules );
                }
              }
            },
            change: function(event) {
              var
                $field      = $(this),
                $fieldGroup = $field.closest($group),
                validationRules = module.get.validation($field)
              ;
              if(validationRules && (settings.on == 'change' || ( $fieldGroup.hasClass(className.error) && settings.revalidate) )) {
                clearTimeout(module.timer);
                module.timer = setTimeout(function() {
                  module.debug('Revalidating field', $field,  module.get.validation($field));
                  module.validate.field( validationRules );
                }, settings.delay);
              }
            }
          },
          beforeUnload: function(event) {
            if (module.is.dirty() && !submitting) {
              var event = event || window.event;

              // For modern browsers
              if (event) {
                event.returnValue = settings.text.leavingMessage;
              }

              // For olders...
              return settings.text.leavingMessage;
            }
          }

        },

        get: {
          ancillaryValue: function(rule) {
            if(!rule.type || (!rule.value && !module.is.bracketedRule(rule))) {
              return false;
            }
            return (rule.value !== undefined)
              ? rule.value
              : rule.type.match(settings.regExp.bracket)[1] + ''
            ;
          },
          ruleName: function(rule) {
            if( module.is.bracketedRule(rule) ) {
              return rule.type.replace(rule.type.match(settings.regExp.bracket)[0], '');
            }
            return rule.type;
          },
          changeEvent: function(type, $input) {
            if(type == 'checkbox' || type == 'radio' || type == 'hidden' || $input.is('select')) {
              return 'change';
            }
            else {
              return module.get.inputEvent();
            }
          },
          inputEvent: function() {
            return (document.createElement('input').oninput !== undefined)
              ? 'input'
              : (document.createElement('input').onpropertychange !== undefined)
                ? 'propertychange'
                : 'keyup'
            ;
          },
          fieldsFromShorthand: function(fields) {
            var
              fullFields = {}
            ;
            $.each(fields, function(name, rules) {
              if(typeof rules == 'string') {
                rules = [rules];
              }
              fullFields[name] = {
                rules: []
              };
              $.each(rules, function(index, rule) {
                fullFields[name].rules.push({ type: rule });
              });
            });
            return fullFields;
          },
          prompt: function(rule, field) {
            var
              ruleName      = module.get.ruleName(rule),
              ancillary     = module.get.ancillaryValue(rule),
              $field        = module.get.field(field.identifier),
              value         = $field.val(),
              prompt        = $.isFunction(rule.prompt)
                ? rule.prompt(value)
                : rule.prompt || settings.prompt[ruleName] || settings.text.unspecifiedRule,
              requiresValue = (prompt.search('{value}') !== -1),
              requiresName  = (prompt.search('{name}') !== -1),
              $label,
              name
            ;
            if(requiresValue) {
              prompt = prompt.replace('{value}', $field.val());
            }
            if(requiresName) {
              $label = $field.closest(selector.group).find('label').eq(0);
              name = ($label.length == 1)
                ? $label.text()
                : $field.prop('placeholder') || settings.text.unspecifiedField
              ;
              prompt = prompt.replace('{name}', name);
            }
            prompt = prompt.replace('{identifier}', field.identifier);
            prompt = prompt.replace('{ruleValue}', ancillary);
            if(!rule.prompt) {
              module.verbose('Using default validation prompt for type', prompt, ruleName);
            }
            return prompt;
          },
          settings: function() {
            if($.isPlainObject(parameters)) {
              var
                keys     = Object.keys(parameters),
                isLegacySettings = (keys.length > 0)
                  ? (parameters[keys[0]].identifier !== undefined && parameters[keys[0]].rules !== undefined)
                  : false
              ;
              if(isLegacySettings) {
                // 1.x (ducktyped)
                settings   = $.extend(true, {}, $.fn.form.settings, legacyParameters);
                validation = $.extend({}, $.fn.form.settings.defaults, parameters);
                module.error(settings.error.oldSyntax, element);
                module.verbose('Extending settings from legacy parameters', validation, settings);
              }
              else {
                // 2.x
                if(parameters.fields && module.is.shorthandFields(parameters.fields)) {
                  parameters.fields = module.get.fieldsFromShorthand(parameters.fields);
                }
                settings   = $.extend(true, {}, $.fn.form.settings, parameters);
                validation = $.extend({}, $.fn.form.settings.defaults, settings.fields);
                module.verbose('Extending settings', validation, settings);
              }
            }
            else {
              settings   = $.fn.form.settings;
              validation = $.fn.form.settings.defaults;
              module.verbose('Using default form validation', validation, settings);
            }

            // shorthand
            namespace       = settings.namespace;
            metadata        = settings.metadata;
            selector        = settings.selector;
            className       = settings.className;
            regExp          = settings.regExp;
            error           = settings.error;
            moduleNamespace = 'module-' + namespace;
            eventNamespace  = '.' + namespace;

            // grab instance
            instance = $module.data(moduleNamespace);

            // refresh selector cache
            module.refresh();
          },
          field: function(identifier) {
            module.verbose('Finding field with identifier', identifier);
            identifier = module.escape.string(identifier);
            var t;
            if((t=$field.filter('#' + identifier)).length > 0 ) {
              return t;
            }
            if((t=$field.filter('[name="' + identifier +'"]')).length > 0 ) {
              return t;
            }
            if((t=$field.filter('[name="' + identifier +'[]"]')).length > 0 ) {
              return t;
            }
            if((t=$field.filter('[data-' + metadata.validate + '="'+ identifier +'"]')).length > 0 ) {
              return t;
            }
            return $('<input/>');
          },
          fields: function(fields) {
            var
              $fields = $()
            ;
            $.each(fields, function(index, name) {
              $fields = $fields.add( module.get.field(name) );
            });
            return $fields;
          },
          validation: function($field) {
            var
              fieldValidation,
              identifier
            ;
            if(!validation) {
              return false;
            }
            $.each(validation, function(fieldName, field) {
              identifier = field.identifier || fieldName;
              $.each(module.get.field(identifier), function(index, groupField) {
                if(groupField == $field[0]) {
                  field.identifier = identifier;
                  fieldValidation = field;
                  return false;
                }
              });
            });
            return fieldValidation || false;
          },
          value: function (field) {
            var
              fields = [],
              results
            ;
            fields.push(field);
            results = module.get.values.call(element, fields);
            return results[field];
          },
          values: function (fields) {
            var
              $fields = Array.isArray(fields)
                ? module.get.fields(fields)
                : $field,
              values = {}
            ;
            $fields.each(function(index, field) {
              var
                $field       = $(field),
                $calendar    = $field.closest(selector.uiCalendar),
                name         = $field.prop('name'),
                value        = $field.val(),
                isCheckbox   = $field.is(selector.checkbox),
                isRadio      = $field.is(selector.radio),
                isMultiple   = (name.indexOf('[]') !== -1),
                isCalendar   = ($calendar.length > 0),
                isChecked    = (isCheckbox)
                  ? $field.is(':checked')
                  : false
              ;
              if(name) {
                if(isMultiple) {
                  name = name.replace('[]', '');
                  if(!values[name]) {
                    values[name] = [];
                  }
                  if(isCheckbox) {
                    if(isChecked) {
                      values[name].push(value || true);
                    }
                    else {
                      values[name].push(false);
                    }
                  }
                  else {
                    values[name].push(value);
                  }
                }
                else {
                  if(isRadio) {
                    if(values[name] === undefined || values[name] == false) {
                      values[name] = (isChecked)
                        ? value || true
                        : false
                      ;
                    }
                  }
                  else if(isCheckbox) {
                    if(isChecked) {
                      values[name] = value || true;
                    }
                    else {
                      values[name] = false;
                    }
                  }
                  else if(isCalendar) {
                    var date = $calendar.calendar('get date');

                    if (date !== null) {
                      if (settings.dateHandling == 'date') {
                        values[name] = date;
                      } else if(settings.dateHandling == 'input') {
                        values[name] = $calendar.calendar('get input date')
                      } else if (settings.dateHandling == 'formatter') {
                        var type = $calendar.calendar('setting', 'type');

                        switch(type) {
                          case 'date':
                          values[name] = settings.formatter.date(date);
                          break;
                          
                          case 'datetime':
                          values[name] = settings.formatter.datetime(date);
                          break;
                          
                          case 'time':
                          values[name] = settings.formatter.time(date);
                          break;
                          
                          case 'month':
                          values[name] = settings.formatter.month(date);
                          break;
                          
                          case 'year':
                          values[name] = settings.formatter.year(date);
                          break;
  
                          default:
                          module.debug('Wrong calendar mode', $calendar, type);
                          values[name] = '';
                        }
                      }
                    } else {
                      values[name] = '';
                    }
                  } else {
                    values[name] = value;
                  }
                }
              }
            });
            return values;
          },
          dirtyFields: function() {
            return $field.filter(function(index, e) {
              return $(e).data(metadata.isDirty);
            });
          }
        },

        has: {

          field: function(identifier) {
            module.verbose('Checking for existence of a field with identifier', identifier);
            identifier = module.escape.string(identifier);
            if(typeof identifier !== 'string') {
              module.error(error.identifier, identifier);
            }
            if($field.filter('#' + identifier).length > 0 ) {
              return true;
            }
            else if( $field.filter('[name="' + identifier +'"]').length > 0 ) {
              return true;
            }
            else if( $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]').length > 0 ) {
              return true;
            }
            return false;
          }

        },

        escape: {
          string: function(text) {
            text =  String(text);
            return text.replace(regExp.escape, '\\$&');
          }
        },

        add: {
          // alias
          rule: function(name, rules) {
            module.add.field(name, rules);
          },
          field: function(name, rules) {
            var
              newValidation = {}
            ;
            if(module.is.shorthandRules(rules)) {
              rules = Array.isArray(rules)
                ? rules
                : [rules]
              ;
              newValidation[name] = {
                rules: []
              };
              $.each(rules, function(index, rule) {
                newValidation[name].rules.push({ type: rule });
              });
            }
            else {
              newValidation[name] = rules;
            }
            validation = $.extend({}, validation, newValidation);
            module.debug('Adding rules', newValidation, validation);
          },
          fields: function(fields) {
            var
              newValidation
            ;
            if(fields && module.is.shorthandFields(fields)) {
              newValidation = module.get.fieldsFromShorthand(fields);
            }
            else {
              newValidation = fields;
            }
            validation = $.extend({}, validation, newValidation);
          },
          prompt: function(identifier, errors, internal) {
            var
              $field       = module.get.field(identifier),
              $fieldGroup  = $field.closest($group),
              $prompt      = $fieldGroup.children(selector.prompt),
              promptExists = ($prompt.length !== 0)
            ;
            errors = (typeof errors == 'string')
              ? [errors]
              : errors
            ;
            module.verbose('Adding field error state', identifier);
            if(!internal) {
              $fieldGroup
                  .addClass(className.error)
              ;
            }
            if(settings.inline) {
              if(!promptExists) {
                $prompt = settings.templates.prompt(errors);
                $prompt
                  .appendTo($fieldGroup)
                ;
              }
              $prompt
                .html(errors[0])
              ;
              if(!promptExists) {
                if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                  module.verbose('Displaying error with css transition', settings.transition);
                  $prompt.transition(settings.transition + ' in', settings.duration);
                }
                else {
                  module.verbose('Displaying error with fallback javascript animation');
                  $prompt
                    .fadeIn(settings.duration)
                  ;
                }
              }
              else {
                module.verbose('Inline errors are disabled, no inline error added', identifier);
              }
            }
          },
          errors: function(errors) {
            module.debug('Adding form error messages', errors);
            module.set.error();
            $message
              .html( settings.templates.error(errors) )
            ;
          }
        },

        remove: {
          rule: function(field, rule) {
            var
              rules = Array.isArray(rule)
                ? rule
                : [rule]
            ;
            if(validation[field] === undefined || !Array.isArray(validation[field].rules)) {
              return;
            }
            if(rule === undefined) {
              module.debug('Removed all rules');
              validation[field].rules = [];
              return;
            }
            $.each(validation[field].rules, function(index, rule) {
              if(rule && rules.indexOf(rule.type) !== -1) {
                module.debug('Removed rule', rule.type);
                validation[field].rules.splice(index, 1);
              }
            });
          },
          field: function(field) {
            var
              fields = Array.isArray(field)
                ? field
                : [field]
            ;
            $.each(fields, function(index, field) {
              module.remove.rule(field);
            });
          },
          // alias
          rules: function(field, rules) {
            if(Array.isArray(field)) {
              $.each(field, function(index, field) {
                module.remove.rule(field, rules);
              });
            }
            else {
              module.remove.rule(field, rules);
            }
          },
          fields: function(fields) {
            module.remove.field(fields);
          },
          prompt: function(identifier) {
            var
              $field      = module.get.field(identifier),
              $fieldGroup = $field.closest($group),
              $prompt     = $fieldGroup.children(selector.prompt)
            ;
            $fieldGroup
              .removeClass(className.error)
            ;
            if(settings.inline && $prompt.is(':visible')) {
              module.verbose('Removing prompt for field', identifier);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                $prompt.transition(settings.transition + ' out', settings.duration, function() {
                  $prompt.remove();
                });
              }
              else {
                $prompt
                  .fadeOut(settings.duration, function(){
                    $prompt.remove();
                  })
                ;
              }
            }
          }
        },

        set: {
          success: function() {
            $module
              .removeClass(className.error)
              .addClass(className.success)
            ;
          },
          defaults: function () {
            $field.each(function (index, el) {
              var
                $el        = $(el),
                $parent    = $el.parent(),
                isCheckbox = ($el.filter(selector.checkbox).length > 0),
                isDropdown = $parent.is(selector.uiDropdown),
                value      = (isCheckbox)
                  ? $el.is(':checked')
                  : $el.val()
              ;
              if (isDropdown) {
                $parent.dropdown('save defaults');
              }
              $el.data(metadata.defaultValue, value);
              $el.data(metadata.isDirty, false);
            });
          },
          error: function() {
            $module
              .removeClass(className.success)
              .addClass(className.error)
            ;
          },
          value: function (field, value) {
            var
              fields = {}
            ;
            fields[field] = value;
            return module.set.values.call(element, fields);
          },
          values: function (fields) {
            if($.isEmptyObject(fields)) {
              return;
            }
            $.each(fields, function(key, value) {
              var
                $field      = module.get.field(key),
                $element    = $field.parent(),
                isMultiple  = Array.isArray(value),
                isCheckbox  = $element.is(selector.uiCheckbox),
                isDropdown  = $element.is(selector.uiDropdown),
                isRadio     = ($field.is(selector.radio) && isCheckbox),
                fieldExists = ($field.length > 0),
                $multipleField
              ;
              if(fieldExists) {
                if(isMultiple && isCheckbox) {
                  module.verbose('Selecting multiple', value, $field);
                  $element.checkbox('uncheck');
                  $.each(value, function(index, value) {
                    $multipleField = $field.filter('[value="' + value + '"]');
                    $element       = $multipleField.parent();
                    if($multipleField.length > 0) {
                      $element.checkbox('check');
                    }
                  });
                }
                else if(isRadio) {
                  module.verbose('Selecting radio value', value, $field);
                  $field.filter('[value="' + value + '"]')
                    .parent(selector.uiCheckbox)
                      .checkbox('check')
                  ;
                }
                else if(isCheckbox) {
                  module.verbose('Setting checkbox value', value, $element);
                  if(value === true) {
                    $element.checkbox('check');
                  }
                  else {
                    $element.checkbox('uncheck');
                  }
                }
                else if(isDropdown) {
                  module.verbose('Setting dropdown value', value, $element);
                  $element.dropdown('set selected', value);
                }
                else {
                  module.verbose('Setting field value', value, $field);
                  $field.val(value);
                }
              }
            });
          },
          dirty: function() {
            module.verbose('Setting state dirty');
            dirty = true;
            history[0] = history[1];
            history[1] = 'dirty';

            if (module.is.justClean()) {
              $module.trigger('dirty');
            }
          },
          clean: function() {
            module.verbose('Setting state clean');
            dirty = false;
            history[0] = history[1];
            history[1] = 'clean';

            if (module.is.justDirty()) {
              $module.trigger('clean');
            }
          },
          asClean: function() {
            module.set.defaults();
            module.set.clean();
          },
          asDirty: function() {
            module.set.defaults();
            module.set.dirty();
          }
        },

        validate: {

          form: function(event, ignoreCallbacks) {
            var values = module.get.values();

            // input keydown event will fire submit repeatedly by browser default
            if(keyHeldDown) {
              return false;
            }

            // reset errors
            formErrors = [];
            if( module.determine.isValid() ) {
              module.debug('Form has no validation errors, submitting');
              module.set.success();
              if(ignoreCallbacks !== true) {
                return settings.onSuccess.call(element, event, values);
              }
            }
            else {
              module.debug('Form has errors');
              module.set.error();
              if(!settings.inline) {
                module.add.errors(formErrors);
              }
              // prevent ajax submit
              if(event && $module.data('moduleApi') !== undefined) {
                event.stopImmediatePropagation();
              }
              if(ignoreCallbacks !== true) {
                return settings.onFailure.call(element, formErrors, values);
              }
            }
          },

          // takes a validation object and returns whether field passes validation
          field: function(field, fieldName, showErrors) {
            showErrors = (showErrors !== undefined)
              ? showErrors
              : true
            ;
            if(typeof field == 'string') {
              module.verbose('Validating field', field);
              fieldName = field;
              field     = validation[field];
            }
            var
              identifier    = field.identifier || fieldName,
              $field        = module.get.field(identifier),
              $dependsField = (field.depends)
                ? module.get.field(field.depends)
                : false,
              fieldValid  = true,
              fieldErrors = []
            ;
            if(!field.identifier) {
              module.debug('Using field name as identifier', identifier);
              field.identifier = identifier;
            }
            var isDisabled = true;
            $.each($field, function(){
                if(!$(this).prop('disabled')) {
                  isDisabled = false;
                  return false;
                }
            });
            if(isDisabled) {
              module.debug('Field is disabled. Skipping', identifier);
            }
            else if(field.optional && module.is.blank($field)){
              module.debug('Field is optional and blank. Skipping', identifier);
            }
            else if(field.depends && module.is.empty($dependsField)) {
              module.debug('Field depends on another value that is not present or empty. Skipping', $dependsField);
            }
            else if(field.rules !== undefined) {
              $field.closest($group).removeClass(className.error);
              $.each(field.rules, function(index, rule) {
                if( module.has.field(identifier)) {
                  var invalidFields = module.validate.rule(field, rule,true) || [];
                  if (invalidFields.length>0){
                    module.debug('Field is invalid', identifier, rule.type);
                    fieldErrors.push(module.get.prompt(rule, field));
                    fieldValid = false;
                    if(showErrors){
                      $(invalidFields).closest($group).addClass(className.error);
                    }
                  }
                }
              });
            }
            if(fieldValid) {
              if(showErrors) {
                module.remove.prompt(identifier, fieldErrors);
                settings.onValid.call($field);
              }
            }
            else {
              if(showErrors) {
                formErrors = formErrors.concat(fieldErrors);
                module.add.prompt(identifier, fieldErrors, true);
                settings.onInvalid.call($field, fieldErrors);
              }
              return false;
            }
            return true;
          },

          // takes validation rule and returns whether field passes rule
          rule: function(field, rule, internal) {
            var
              $field       = module.get.field(field.identifier),
              ancillary    = module.get.ancillaryValue(rule),
              ruleName     = module.get.ruleName(rule),
              ruleFunction = settings.rules[ruleName],
              invalidFields = [],
              isCheckbox = $field.is(selector.checkbox),
              isValid = function(field){
                var value = (isCheckbox ? $(field).filter(':checked').val() : $(field).val());
                // cast to string avoiding encoding special values
                value = (value === undefined || value === '' || value === null)
                    ? ''
                    : (settings.shouldTrim) ? $.trim(value + '') : String(value + '')
                ;
                return ruleFunction.call(field, value, ancillary, $module);
              }
            ;
            if( !$.isFunction(ruleFunction) ) {
              module.error(error.noRule, ruleName);
              return;
            }
            if(isCheckbox) {
              if (!isValid($field)) {
                invalidFields = $field;
              }
            } else {
              $.each($field, function (index, field) {
                if (!isValid(field)) {
                  invalidFields.push(field);
                }
              });
            }
            return internal ? invalidFields : !(invalidFields.length>0);
          }
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      module.initialize();
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.form.settings = {

  name              : 'Form',
  namespace         : 'form',

  debug             : false,
  verbose           : false,
  performance       : true,

  fields            : false,

  keyboardShortcuts : true,
  on                : 'submit',
  inline            : false,

  delay             : 200,
  revalidate        : true,
  shouldTrim        : true,

  transition        : 'scale',
  duration          : 200,

  preventLeaving    : false,
  dateHandling      : 'date', // 'date', 'input', 'formatter'

  onValid           : function() {},
  onInvalid         : function() {},
  onSuccess         : function() { return true; },
  onFailure         : function() { return false; },
  onDirty           : function() {},
  onClean           : function() {},

  metadata : {
    defaultValue : 'default',
    validate     : 'validate',
    isDirty      : 'isDirty'
  },

  regExp: {
    htmlID  : /^[a-zA-Z][\w:.-]*$/g,
    bracket : /\[(.*)\]/i,
    decimal : /^\d+\.?\d*$/,
    email   : /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    escape  : /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|:,=@]/g,
    flags   : /^\/(.*)\/(.*)?/,
    integer : /^\-?\d+$/,
    number  : /^\-?\d*(\.\d+)?$/,
    url     : /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i
  },

  text: {
    unspecifiedRule  : 'Please enter a valid value',
    unspecifiedField : 'This field',
    leavingMessage   : 'There are unsaved changes on this page which will be discarded if you continue.'
  },

  prompt: {
    empty                : '{name} must have a value',
    checked              : '{name} must be checked',
    email                : '{name} must be a valid e-mail',
    url                  : '{name} must be a valid url',
    regExp               : '{name} is not formatted correctly',
    integer              : '{name} must be an integer',
    decimal              : '{name} must be a decimal number',
    number               : '{name} must be set to a number',
    is                   : '{name} must be "{ruleValue}"',
    isExactly            : '{name} must be exactly "{ruleValue}"',
    not                  : '{name} cannot be set to "{ruleValue}"',
    notExactly           : '{name} cannot be set to exactly "{ruleValue}"',
    contain              : '{name} must contain "{ruleValue}"',
    containExactly       : '{name} must contain exactly "{ruleValue}"',
    doesntContain        : '{name} cannot contain  "{ruleValue}"',
    doesntContainExactly : '{name} cannot contain exactly "{ruleValue}"',
    minLength            : '{name} must be at least {ruleValue} characters',
    length               : '{name} must be at least {ruleValue} characters',
    exactLength          : '{name} must be exactly {ruleValue} characters',
    maxLength            : '{name} cannot be longer than {ruleValue} characters',
    match                : '{name} must match {ruleValue} field',
    different            : '{name} must have a different value than {ruleValue} field',
    creditCard           : '{name} must be a valid credit card number',
    minCount             : '{name} must have at least {ruleValue} choices',
    exactCount           : '{name} must have exactly {ruleValue} choices',
    maxCount             : '{name} must have {ruleValue} or less choices'
  },

  selector : {
    checkbox   : 'input[type="checkbox"], input[type="radio"]',
    clear      : '.clear',
    field      : 'input, textarea, select',
    group      : '.field',
    input      : 'input',
    message    : '.error.message',
    prompt     : '.prompt.label',
    radio      : 'input[type="radio"]',
    reset      : '.reset:not([type="reset"])',
    submit     : '.submit:not([type="submit"])',
    uiCheckbox : '.ui.checkbox',
    uiDropdown : '.ui.dropdown',
    uiCalendar : '.ui.calendar'
  },

  className : {
    error   : 'error',
    label   : 'ui prompt label',
    pressed : 'down',
    success : 'success'
  },

  error: {
    identifier : 'You must specify a string identifier for each field',
    method     : 'The method you called is not defined.',
    noRule     : 'There is no rule matching the one you specified',
    oldSyntax  : 'Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically.'
  },

  templates: {

    // template that produces error message
    error: function(errors) {
      var
        html = '<ul class="list">'
      ;
      $.each(errors, function(index, value) {
        html += '<li>' + value + '</li>';
      });
      html += '</ul>';
      return $(html);
    },

    // template that produces label
    prompt: function(errors) {
      return $('<div/>')
        .addClass('ui basic red pointing prompt label')
        .html(errors[0])
      ;
    }
  },

  formatter: {
    date: function(date) {
      return Intl.DateTimeFormat('en-GB').format(date);
    },
    datetime: function(date) {
      return Intl.DateTimeFormat('en-GB', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    },
    time: function(date) {
      return Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    },
    month: function(date) {
      return Intl.DateTimeFormat('en-GB', {
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    },
    year: function(date) {
      return Intl.DateTimeFormat('en-GB', {
        year: 'numeric'
      }).format(date);
    }
  },

  rules: {

    // is not empty or blank string
    empty: function(value) {
      return !(value === undefined || '' === value || Array.isArray(value) && value.length === 0);
    },

    // checkbox checked
    checked: function() {
      return ($(this).filter(':checked').length > 0);
    },

    // is most likely an email
    email: function(value){
      return $.fn.form.settings.regExp.email.test(value);
    },

    // value is most likely url
    url: function(value) {
      return $.fn.form.settings.regExp.url.test(value);
    },

    // matches specified regExp
    regExp: function(value, regExp) {
      if(regExp instanceof RegExp) {
        return value.match(regExp);
      }
      var
        regExpParts = regExp.match($.fn.form.settings.regExp.flags),
        flags
      ;
      // regular expression specified as /baz/gi (flags)
      if(regExpParts) {
        regExp = (regExpParts.length >= 2)
          ? regExpParts[1]
          : regExp
        ;
        flags = (regExpParts.length >= 3)
          ? regExpParts[2]
          : ''
        ;
      }
      return value.match( new RegExp(regExp, flags) );
    },

    // is valid integer or matches range
    integer: function(value, range) {
      var
        intRegExp = $.fn.form.settings.regExp.integer,
        min,
        max,
        parts
      ;
      if( !range || ['', '..'].indexOf(range) !== -1) {
        // do nothing
      }
      else if(range.indexOf('..') == -1) {
        if(intRegExp.test(range)) {
          min = max = range - 0;
        }
      }
      else {
        parts = range.split('..', 2);
        if(intRegExp.test(parts[0])) {
          min = parts[0] - 0;
        }
        if(intRegExp.test(parts[1])) {
          max = parts[1] - 0;
        }
      }
      return (
        intRegExp.test(value) &&
        (min === undefined || value >= min) &&
        (max === undefined || value <= max)
      );
    },

    // is valid number (with decimal)
    decimal: function(value) {
      return $.fn.form.settings.regExp.decimal.test(value);
    },

    // is valid number
    number: function(value) {
      return $.fn.form.settings.regExp.number.test(value);
    },

    // is value (case insensitive)
    is: function(value, text) {
      text = (typeof text == 'string')
        ? text.toLowerCase()
        : text
      ;
      value = (typeof value == 'string')
        ? value.toLowerCase()
        : value
      ;
      return (value == text);
    },

    // is value
    isExactly: function(value, text) {
      return (value == text);
    },

    // value is not another value (case insensitive)
    not: function(value, notValue) {
      value = (typeof value == 'string')
        ? value.toLowerCase()
        : value
      ;
      notValue = (typeof notValue == 'string')
        ? notValue.toLowerCase()
        : notValue
      ;
      return (value != notValue);
    },

    // value is not another value (case sensitive)
    notExactly: function(value, notValue) {
      return (value != notValue);
    },

    // value contains text (insensitive)
    contains: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text, 'i') ) !== -1);
    },

    // value contains text (case sensitive)
    containsExactly: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text) ) !== -1);
    },

    // value contains text (insensitive)
    doesntContain: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text, 'i') ) === -1);
    },

    // value contains text (case sensitive)
    doesntContainExactly: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text) ) === -1);
    },

    // is at least string length
    minLength: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length >= requiredLength)
        : false
      ;
    },

    // see rls notes for 2.0.6 (this is a duplicate of minLength)
    length: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length >= requiredLength)
        : false
      ;
    },

    // is exactly length
    exactLength: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length == requiredLength)
        : false
      ;
    },

    // is less than length
    maxLength: function(value, maxLength) {
      return (value !== undefined)
        ? (value.length <= maxLength)
        : false
      ;
    },

    // matches another field
    match: function(value, identifier, $module) {
      var
        matchingValue,
        matchingElement
      ;
      if((matchingElement = $module.find('[data-validate="'+ identifier +'"]')).length > 0 ) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('#' + identifier)).length > 0) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('[name="' + identifier +'"]')).length > 0) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('[name="' + identifier +'[]"]')).length > 0 ) {
        matchingValue = matchingElement;
      }
      return (matchingValue !== undefined)
        ? ( value.toString() == matchingValue.toString() )
        : false
      ;
    },

    // different than another field
    different: function(value, identifier, $module) {
      // use either id or name of field
      var
        matchingValue,
        matchingElement
      ;
      if((matchingElement = $module.find('[data-validate="'+ identifier +'"]')).length > 0 ) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('#' + identifier)).length > 0) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('[name="' + identifier +'"]')).length > 0) {
        matchingValue = matchingElement.val();
      }
      else if((matchingElement = $module.find('[name="' + identifier +'[]"]')).length > 0 ) {
        matchingValue = matchingElement;
      }
      return (matchingValue !== undefined)
        ? ( value.toString() !== matchingValue.toString() )
        : false
      ;
    },

    creditCard: function(cardNumber, cardTypes) {
      var
        cards = {
          visa: {
            pattern : /^4/,
            length  : [16]
          },
          amex: {
            pattern : /^3[47]/,
            length  : [15]
          },
          mastercard: {
            pattern : /^5[1-5]/,
            length  : [16]
          },
          discover: {
            pattern : /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            length  : [16]
          },
          unionPay: {
            pattern : /^(62|88)/,
            length  : [16, 17, 18, 19]
          },
          jcb: {
            pattern : /^35(2[89]|[3-8][0-9])/,
            length  : [16]
          },
          maestro: {
            pattern : /^(5018|5020|5038|6304|6759|676[1-3])/,
            length  : [12, 13, 14, 15, 16, 17, 18, 19]
          },
          dinersClub: {
            pattern : /^(30[0-5]|^36)/,
            length  : [14]
          },
          laser: {
            pattern : /^(6304|670[69]|6771)/,
            length  : [16, 17, 18, 19]
          },
          visaElectron: {
            pattern : /^(4026|417500|4508|4844|491(3|7))/,
            length  : [16]
          }
        },
        valid         = {},
        validCard     = false,
        requiredTypes = (typeof cardTypes == 'string')
          ? cardTypes.split(',')
          : false,
        unionPay,
        validation
      ;

      if(typeof cardNumber !== 'string' || cardNumber.length === 0) {
        return;
      }

      // allow dashes in card
      cardNumber = cardNumber.replace(/[\-]/g, '');

      // verify card types
      if(requiredTypes) {
        $.each(requiredTypes, function(index, type){
          // verify each card type
          validation = cards[type];
          if(validation) {
            valid = {
              length  : ($.inArray(cardNumber.length, validation.length) !== -1),
              pattern : (cardNumber.search(validation.pattern) !== -1)
            };
            if(valid.length && valid.pattern) {
              validCard = true;
            }
          }
        });

        if(!validCard) {
          return false;
        }
      }

      // skip luhn for UnionPay
      unionPay = {
        number  : ($.inArray(cardNumber.length, cards.unionPay.length) !== -1),
        pattern : (cardNumber.search(cards.unionPay.pattern) !== -1)
      };
      if(unionPay.number && unionPay.pattern) {
        return true;
      }

      // verify luhn, adapted from  <https://gist.github.com/2134376>
      var
        length        = cardNumber.length,
        multiple      = 0,
        producedValue = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
        ],
        sum           = 0
      ;
      while (length--) {
        sum += producedValue[multiple][parseInt(cardNumber.charAt(length), 10)];
        multiple ^= 1;
      }
      return (sum % 10 === 0 && sum > 0);
    },

    minCount: function(value, minCount) {
      if(minCount == 0) {
        return true;
      }
      if(minCount == 1) {
        return (value !== '');
      }
      return (value.split(',').length >= minCount);
    },

    exactCount: function(value, exactCount) {
      if(exactCount == 0) {
        return (value === '');
      }
      if(exactCount == 1) {
        return (value !== '' && value.search(',') === -1);
      }
      return (value.split(',').length == exactCount);
    },

    maxCount: function(value, maxCount) {
      if(maxCount == 0) {
        return false;
      }
      if(maxCount == 1) {
        return (value.search(',') === -1);
      }
      return (value.split(',').length <= maxCount);
    }
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Accordion
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.accordion = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;
  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.accordion.settings, parameters)
          : $.extend({}, $.fn.accordion.settings),

        className       = settings.className,
        namespace       = settings.namespace,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        $module  = $(this),
        $title   = $module.find(selector.title),
        $content = $module.find(selector.content),

        element  = this,
        instance = $module.data(moduleNamespace),
        observer,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing', $module);
          module.bind.events();
          if(settings.observeChanges) {
            module.observeChanges();
          }
          module.instantiate();
        },

        instantiate: function() {
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.debug('Destroying previous instance', $module);
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          $title   = $module.find(selector.title);
          $content = $module.find(selector.content);
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, updating selector cache');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        bind: {
          events: function() {
            module.debug('Binding delegated events');
            $module
              .on(settings.on + eventNamespace, selector.trigger, module.event.click)
            ;
          }
        },

        event: {
          click: function() {
            module.toggle.call(this);
          }
        },

        toggle: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query).closest(selector.title)
              : $(this).closest(selector.title),
            $activeContent = $activeTitle.next($content),
            isAnimating = $activeContent.hasClass(className.animating),
            isActive    = $activeContent.hasClass(className.active),
            isOpen      = (isActive && !isAnimating),
            isOpening   = (!isActive && isAnimating)
          ;
          module.debug('Toggling visibility of content', $activeTitle);
          if(isOpen || isOpening) {
            if(settings.collapsible) {
              module.close.call($activeTitle);
            }
            else {
              module.debug('Cannot close accordion content collapsing is disabled');
            }
          }
          else {
            module.open.call($activeTitle);
          }
        },

        open: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query).closest(selector.title)
              : $(this).closest(selector.title),
            $activeContent = $activeTitle.next($content),
            isAnimating = $activeContent.hasClass(className.animating),
            isActive    = $activeContent.hasClass(className.active),
            isOpen      = (isActive || isAnimating)
          ;
          if(isOpen) {
            module.debug('Accordion already open, skipping', $activeContent);
            return;
          }
          module.debug('Opening accordion content', $activeTitle);
          settings.onOpening.call($activeContent);
          settings.onChanging.call($activeContent);
          if(settings.exclusive) {
            module.closeOthers.call($activeTitle);
          }
          $activeTitle
            .addClass(className.active)
          ;
          $activeContent
            .stop(true, true)
            .addClass(className.animating)
          ;
          if(settings.animateChildren) {
            if($.fn.transition !== undefined && $module.transition('is supported')) {
              $activeContent
                .children()
                  .transition({
                    animation        : 'fade in',
                    queue            : false,
                    useFailSafe      : true,
                    debug            : settings.debug,
                    verbose          : settings.verbose,
                    duration         : settings.duration,
                    skipInlineHidden : true
                  })
              ;
            }
            else {
              $activeContent
                .children()
                  .stop(true, true)
                  .animate({
                    opacity: 1
                  }, settings.duration, module.resetOpacity)
              ;
            }
          }
          $activeContent
            .slideDown(settings.duration, settings.easing, function() {
              $activeContent
                .removeClass(className.animating)
                .addClass(className.active)
              ;
              module.reset.display.call(this);
              settings.onOpen.call(this);
              settings.onChange.call(this);
            })
          ;
        },

        close: function(query) {
          var
            $activeTitle = (query !== undefined)
              ? (typeof query === 'number')
                ? $title.eq(query)
                : $(query).closest(selector.title)
              : $(this).closest(selector.title),
            $activeContent = $activeTitle.next($content),
            isAnimating    = $activeContent.hasClass(className.animating),
            isActive       = $activeContent.hasClass(className.active),
            isOpening      = (!isActive && isAnimating),
            isClosing      = (isActive && isAnimating)
          ;
          if((isActive || isOpening) && !isClosing) {
            module.debug('Closing accordion content', $activeContent);
            settings.onClosing.call($activeContent);
            settings.onChanging.call($activeContent);
            $activeTitle
              .removeClass(className.active)
            ;
            $activeContent
              .stop(true, true)
              .addClass(className.animating)
            ;
            if(settings.animateChildren) {
              if($.fn.transition !== undefined && $module.transition('is supported')) {
                $activeContent
                  .children()
                    .transition({
                      animation        : 'fade out',
                      queue            : false,
                      useFailSafe      : true,
                      debug            : settings.debug,
                      verbose          : settings.verbose,
                      duration         : settings.duration,
                      skipInlineHidden : true
                    })
                ;
              }
              else {
                $activeContent
                  .children()
                    .stop(true, true)
                    .animate({
                      opacity: 0
                    }, settings.duration, module.resetOpacity)
                ;
              }
            }
            $activeContent
              .slideUp(settings.duration, settings.easing, function() {
                $activeContent
                  .removeClass(className.animating)
                  .removeClass(className.active)
                ;
                module.reset.display.call(this);
                settings.onClose.call(this);
                settings.onChange.call(this);
              })
            ;
          }
        },

        closeOthers: function(index) {
          var
            $activeTitle = (index !== undefined)
              ? $title.eq(index)
              : $(this).closest(selector.title),
            $parentTitles    = $activeTitle.parents(selector.content).prev(selector.title),
            $activeAccordion = $activeTitle.closest(selector.accordion),
            activeSelector   = selector.title + '.' + className.active + ':visible',
            activeContent    = selector.content + '.' + className.active + ':visible',
            $openTitles,
            $nestedTitles,
            $openContents
          ;
          if(settings.closeNested) {
            $openTitles   = $activeAccordion.find(activeSelector).not($parentTitles);
            $openContents = $openTitles.next($content);
          }
          else {
            $openTitles   = $activeAccordion.find(activeSelector).not($parentTitles);
            $nestedTitles = $activeAccordion.find(activeContent).find(activeSelector).not($parentTitles);
            $openTitles   = $openTitles.not($nestedTitles);
            $openContents = $openTitles.next($content);
          }
          if( ($openTitles.length > 0) ) {
            module.debug('Exclusive enabled, closing other content', $openTitles);
            $openTitles
              .removeClass(className.active)
            ;
            $openContents
              .removeClass(className.animating)
              .stop(true, true)
            ;
            if(settings.animateChildren) {
              if($.fn.transition !== undefined && $module.transition('is supported')) {
                $openContents
                  .children()
                    .transition({
                      animation        : 'fade out',
                      useFailSafe      : true,
                      debug            : settings.debug,
                      verbose          : settings.verbose,
                      duration         : settings.duration,
                      skipInlineHidden : true
                    })
                ;
              }
              else {
                $openContents
                  .children()
                    .stop(true, true)
                    .animate({
                      opacity: 0
                    }, settings.duration, module.resetOpacity)
                ;
              }
            }
            $openContents
              .slideUp(settings.duration , settings.easing, function() {
                $(this).removeClass(className.active);
                module.reset.display.call(this);
              })
            ;
          }
        },

        reset: {

          display: function() {
            module.verbose('Removing inline display from element', this);
            $(this).css('display', '');
            if( $(this).attr('style') === '') {
              $(this)
                .attr('style', '')
                .removeAttr('style')
              ;
            }
          },

          opacity: function() {
            module.verbose('Removing inline opacity from element', this);
            $(this).css('opacity', '');
            if( $(this).attr('style') === '') {
              $(this)
                .attr('style', '')
                .removeAttr('style')
              ;
            }
          },

        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          module.debug('Changing internal', name, value);
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, module, name);
            }
            else {
              module[name] = value;
            }
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.accordion.settings = {

  name            : 'Accordion',
  namespace       : 'accordion',

  silent          : false,
  debug           : false,
  verbose         : false,
  performance     : true,

  on              : 'click', // event on title that opens accordion

  observeChanges  : true,  // whether accordion should automatically refresh on DOM insertion

  exclusive       : true,  // whether a single accordion content panel should be open at once
  collapsible     : true,  // whether accordion content can be closed
  closeNested     : false, // whether nested content should be closed when a panel is closed
  animateChildren : true,  // whether children opacity should be animated

  duration        : 350, // duration of animation
  easing          : 'easeOutQuad', // easing equation for animation

  onOpening       : function(){}, // callback before open animation
  onClosing       : function(){}, // callback before closing animation
  onChanging      : function(){}, // callback before closing or opening animation

  onOpen          : function(){}, // callback after open animation
  onClose         : function(){}, // callback after closing animation
  onChange        : function(){}, // callback after closing or opening animation

  error: {
    method : 'The method you called is not defined'
  },

  className   : {
    active    : 'active',
    animating : 'animating'
  },

  selector    : {
    accordion : '.accordion',
    title     : '.title',
    trigger   : '.title',
    content   : '.content'
  }

};

// Adds easing
$.extend( $.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  }
});

})( jQuery, window, document );


/*!
 * # Fomantic-UI - Calendar
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.calendar = function(parameters) {
  var
    $allModules    = $(this),

    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue,
    timeGapTable = {
      '5': {'row': 4, 'column': 3 },
      '10': {'row': 3, 'column': 2 },
      '15': {'row': 2, 'column': 2 },
      '20': {'row': 3, 'column': 1 },
      '30': {'row': 2, 'column': 1 }
    }
  ;

  $allModules
    .each(function () {
      var
        settings = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.calendar.settings, parameters)
          : $.extend({}, $.fn.calendar.settings),

        className = settings.className,
        namespace = settings.namespace,
        selector = settings.selector,
        formatter = settings.formatter,
        parser = settings.parser,
        metadata = settings.metadata,
        timeGap = timeGapTable[settings.minTimeGap],
        error = settings.error,

        eventNamespace = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module = $(this),
        $input = $module.find(selector.input),
        $container = $module.find(selector.popup),
        $activator = $module.find(selector.activator),

        element = this,
        instance = $module.data(moduleNamespace),

        isTouch,
        isTouchDown = false,
        focusDateUsedForRange = false,
        module
      ;

      module = {

        initialize: function () {
          module.debug('Initializing calendar for', element, $module);

          isTouch = module.get.isTouch();
          module.setup.config();
          module.setup.popup();
          module.setup.inline();
          module.setup.input();
          module.setup.date();
          module.create.calendar();

          module.bind.events();
          module.instantiate();
        },

        instantiate: function () {
          module.verbose('Storing instance of calendar');
          instance = module;
          $module.data(moduleNamespace, instance);
        },

        destroy: function () {
          module.verbose('Destroying previous calendar for', element);
          $module.removeData(moduleNamespace);
          module.unbind.events();
        },

        setup: {
          config: function () {
            if (module.get.minDate() !== null) {
              module.set.minDate($module.data(metadata.minDate));
            }
            if (module.get.maxDate() !== null) {
              module.set.maxDate($module.data(metadata.maxDate));
            }
          },
          popup: function () {
            if (settings.inline) {
              return;
            }
            if (!$activator.length) {
              $activator = $module.children().first();
              if (!$activator.length) {
                return;
              }
            }
            if ($.fn.popup === undefined) {
              module.error(error.popup);
              return;
            }
            if (!$container.length) {
              //prepend the popup element to the activator's parent so that it has less chance of messing with
              //the styling (eg input action button needs to be the last child to have correct border radius)
              var $activatorParent = $activator.parent(),
                  domPositionFunction = $activatorParent.closest(selector.append).length !== 0 ? 'appendTo' : 'prependTo';
              $container = $('<div/>').addClass(className.popup)[domPositionFunction]($activatorParent);
            }
            $container.addClass(className.calendar);
            var onVisible = settings.onVisible;
            var onHidden = settings.onHidden;
            if (!$input.length) {
              //no input, $container has to handle focus/blur
              $container.attr('tabindex', '0');
              onVisible = function () {
                module.focus();
                return settings.onVisible.apply($container, arguments);
              };
              onHidden = function () {
                module.blur();
                return settings.onHidden.apply($container, arguments);
              };
            }
            var onShow = function () {
              //reset the focus date onShow
              module.set.focusDate(module.get.date());
              module.set.mode(settings.startMode);
              return settings.onShow.apply($container, arguments);
            };
            var on = settings.on || ($input.length ? 'focus' : 'click');
            var options = $.extend({}, settings.popupOptions, {
              popup: $container,
              on: on,
              hoverable: on === 'hover',
              onShow: onShow,
              onVisible: onVisible,
              onHide: settings.onHide,
              onHidden: onHidden
            });
            module.popup(options);
          },
          inline: function () {
            if ($activator.length && !settings.inline) {
              return;
            }
            $container = $('<div/>').addClass(className.calendar).appendTo($module);
            if (!$input.length) {
              $container.attr('tabindex', '0');
            }
          },
          input: function () {
            if (settings.touchReadonly && $input.length && isTouch) {
              $input.prop('readonly', true);
            }
          },
          date: function () {
            if (settings.initialDate) {
              var date = parser.date(settings.initialDate, settings);
              module.set.date(date, settings.formatInput, false);
            } else if ($module.data(metadata.date) !== undefined) {
              var date = parser.date($module.data(metadata.date), settings);
              module.set.date(date, settings.formatInput, false);
            } else if ($input.length) {
              var val = $input.val();
              var date = parser.date(val, settings);
              module.set.date(date, settings.formatInput, false);
            }
          }
        },

        create: {
          calendar: function () {
            var i, r, c, p, row, cell, pageGrid;

            var mode = module.get.mode();
            var today = new Date();
            var date = module.get.date();
            var focusDate = module.get.focusDate();
            var display = focusDate || date || settings.initialDate || today;
            display = module.helper.dateInRange(display);

            if (!focusDate) {
              focusDate = display;
              module.set.focusDate(focusDate, false, false);
            }

            var isYear = mode === 'year';
            var isMonth = mode === 'month';
            var isDay = mode === 'day';
            var isHour = mode === 'hour';
            var isMinute = mode === 'minute';
            var isTimeOnly = settings.type === 'time';

            var multiMonth = Math.max(settings.multiMonth, 1);
            var monthOffset = !isDay ? 0 : module.get.monthOffset();

            var minute = display.getMinutes();
            var hour = display.getHours();
            var day = display.getDate();
            var startMonth = display.getMonth() + monthOffset;
            var year = display.getFullYear();

            var columns = isDay ? settings.showWeekNumbers ? 8 : 7 : isHour ? 4 : timeGap['column'];
            var rows = isDay || isHour ? 6 : timeGap['row'];
            var pages = isDay ? multiMonth : 1;

            var container = $container;
            var tooltipPosition = container.hasClass("left") ? "right center" : "left center";
            container.empty();
            if (pages > 1) {
              pageGrid = $('<div/>').addClass(className.grid).appendTo(container);
            }

            for (p = 0; p < pages; p++) {
              if (pages > 1) {
                var pageColumn = $('<div/>').addClass(className.column).appendTo(pageGrid);
                container = pageColumn;
              }

              var month = startMonth + p;
              var firstMonthDayColumn = (new Date(year, month, 1).getDay() - settings.firstDayOfWeek % 7 + 7) % 7;
              if (!settings.constantHeight && isDay) {
                var requiredCells = new Date(year, month + 1, 0).getDate() + firstMonthDayColumn;
                rows = Math.ceil(requiredCells / 7);
              }

              var yearChange = isYear ? 10 : isMonth ? 1 : 0;
              var monthChange = isDay ? 1 : 0;
              var dayChange = isHour || isMinute ? 1 : 0;
              var prevNextDay = isHour || isMinute ? day : 1;
              var prevDate = new Date(year - yearChange, month - monthChange, prevNextDay - dayChange, hour);
              var nextDate = new Date(year + yearChange, month + monthChange, prevNextDay + dayChange, hour);

              var prevLast = isYear ? new Date(Math.ceil(year / 10) * 10 - 9, 0, 0) :
                isMonth ? new Date(year, 0, 0) : isDay ? new Date(year, month, 0) : new Date(year, month, day, -1);
              var nextFirst = isYear ? new Date(Math.ceil(year / 10) * 10 + 1, 0, 1) :
                isMonth ? new Date(year + 1, 0, 1) : isDay ? new Date(year, month + 1, 1) : new Date(year, month, day + 1);

              var tempMode = mode;
              if (isDay && settings.showWeekNumbers){
                tempMode += ' andweek';
              }
              var table = $('<table/>').addClass(className.table).addClass(tempMode).appendTo(container);
              var textColumns = columns;
              //no header for time-only mode
              if (!isTimeOnly) {
                var thead = $('<thead/>').appendTo(table);

                row = $('<tr/>').appendTo(thead);
                cell = $('<th/>').attr('colspan', '' + columns).appendTo(row);

                var headerDate = isYear || isMonth ? new Date(year, 0, 1) :
                  isDay ? new Date(year, month, 1) : new Date(year, month, day, hour, minute);
                var headerText = $('<span/>').addClass(className.link).appendTo(cell);
                headerText.text(formatter.header(headerDate, mode, settings));
                var newMode = isMonth ? (settings.disableYear ? 'day' : 'year') :
                  isDay ? (settings.disableMonth ? 'year' : 'month') : 'day';
                headerText.data(metadata.mode, newMode);

                if (p === 0) {
                  var prev = $('<span/>').addClass(className.prev).appendTo(cell);
                  prev.data(metadata.focusDate, prevDate);
                  prev.toggleClass(className.disabledCell, !module.helper.isDateInRange(prevLast, mode));
                  $('<i/>').addClass(className.prevIcon).appendTo(prev);
                }

                if (p === pages - 1) {
                  var next = $('<span/>').addClass(className.next).appendTo(cell);
                  next.data(metadata.focusDate, nextDate);
                  next.toggleClass(className.disabledCell, !module.helper.isDateInRange(nextFirst, mode));
                  $('<i/>').addClass(className.nextIcon).appendTo(next);
                }
                if (isDay) {
                  row = $('<tr/>').appendTo(thead);
                  if(settings.showWeekNumbers) {
                      cell = $('<th/>').appendTo(row);
                      cell.text(settings.text.weekNo);
                      cell.addClass(className.weekCell);
                      textColumns--;
                  }
                  for (i = 0; i < textColumns; i++) {
                    cell = $('<th/>').appendTo(row);
                    cell.text(formatter.dayColumnHeader((i + settings.firstDayOfWeek) % 7, settings));
                  }
                }
              }

              var tbody = $('<tbody/>').appendTo(table);
              i = isYear ? Math.ceil(year / 10) * 10 - 9 : isDay ? 1 - firstMonthDayColumn : 0;
              for (r = 0; r < rows; r++) {
                row = $('<tr/>').appendTo(tbody);
                if(isDay && settings.showWeekNumbers){
                    cell = $('<th/>').appendTo(row);
                    cell.text(module.get.weekOfYear(year,month,i+1-settings.firstDayOfWeek));
                    cell.addClass(className.weekCell);
                }
                for (c = 0; c < textColumns; c++, i++) {
                  var cellDate = isYear ? new Date(i, month, 1, hour, minute) :
                    isMonth ? new Date(year, i, 1, hour, minute) : isDay ? new Date(year, month, i, hour, minute) :
                      isHour ? new Date(year, month, day, i) : new Date(year, month, day, hour, i * settings.minTimeGap);
                  var cellText = isYear ? i :
                    isMonth ? settings.text.monthsShort[i] : isDay ? cellDate.getDate() :
                      formatter.time(cellDate, settings, true);
                  cell = $('<td/>').addClass(className.cell).appendTo(row);
                  cell.text(cellText);
                  cell.data(metadata.date, cellDate);
                  var adjacent = isDay && cellDate.getMonth() !== ((month + 12) % 12);
                  var disabled = (!settings.selectAdjacentDays && adjacent) || !module.helper.isDateInRange(cellDate, mode) || settings.isDisabled(cellDate, mode) || module.helper.isDisabled(cellDate, mode) || !module.helper.isEnabled(cellDate, mode);
                  if (disabled) {
                    var disabledDate = module.helper.findDayAsObject(cellDate, mode, settings.disabledDates);
                    if (disabledDate !== null && disabledDate[metadata.message]) {
                      cell.attr("data-tooltip", disabledDate[metadata.message]);
                      cell.attr("data-position", tooltipPosition);
                    }
                  } else {
                    var eventDate = module.helper.findDayAsObject(cellDate, mode, settings.eventDates);
                    if (eventDate !== null) {
                      cell.addClass(eventDate[metadata.class] || settings.eventClass);
                      if (eventDate[metadata.message]) {
                        cell.attr("data-tooltip", eventDate[metadata.message]);
                        cell.attr("data-position", tooltipPosition);
                      }
                    }
                  }
                  var active = module.helper.dateEqual(cellDate, date, mode);
                  var isToday = module.helper.dateEqual(cellDate, today, mode);
                  cell.toggleClass(className.adjacentCell, adjacent);
                  cell.toggleClass(className.disabledCell, disabled);
                  cell.toggleClass(className.activeCell, active && !adjacent);
                  if (!isHour && !isMinute) {
                    cell.toggleClass(className.todayCell, !adjacent && isToday);
                  }

                  // Allow for external modifications of each cell
                  var cellOptions = {
                    mode: mode,
                    adjacent: adjacent,
                    disabled: disabled,
                    active: active,
                    today: isToday
                  };
                  formatter.cell(cell, cellDate, cellOptions);

                  if (module.helper.dateEqual(cellDate, focusDate, mode)) {
                    //ensure that the focus date is exactly equal to the cell date
                    //so that, if selected, the correct value is set
                    module.set.focusDate(cellDate, false, false);
                  }
                }
              }

              if (settings.today) {
                var todayRow = $('<tr/>').appendTo(tbody);
                var todayButton = $('<td/>').attr('colspan', '' + columns).addClass(className.today).appendTo(todayRow);
                todayButton.text(formatter.today(settings));
                todayButton.data(metadata.date, today);
              }

              module.update.focus(false, table);
            }
          }
        },

        update: {
          focus: function (updateRange, container) {
            container = container || $container;
            var mode = module.get.mode();
            var date = module.get.date();
            var focusDate = module.get.focusDate();
            var startDate = module.get.startDate();
            var endDate = module.get.endDate();
            var rangeDate = (updateRange ? focusDate : null) || date || (!isTouch ? focusDate : null);

            container.find('td').each(function () {
              var cell = $(this);
              var cellDate = cell.data(metadata.date);
              if (!cellDate) {
                return;
              }
              var disabled = cell.hasClass(className.disabledCell);
              var active = cell.hasClass(className.activeCell);
              var adjacent = cell.hasClass(className.adjacentCell);
              var focused = module.helper.dateEqual(cellDate, focusDate, mode);
              var inRange = !rangeDate ? false :
                ((!!startDate && module.helper.isDateInRange(cellDate, mode, startDate, rangeDate)) ||
                (!!endDate && module.helper.isDateInRange(cellDate, mode, rangeDate, endDate)));
              cell.toggleClass(className.focusCell, focused && (!isTouch || isTouchDown) && (!adjacent || (settings.selectAdjacentDays && adjacent)) && !disabled);
              cell.toggleClass(className.rangeCell, inRange && !active && !disabled);
            });
          }
        },

        refresh: function () {
          module.create.calendar();
        },

        bind: {
          events: function () {
            module.debug('Binding events');
            $container.on('mousedown' + eventNamespace, module.event.mousedown);
            $container.on('touchstart' + eventNamespace, module.event.mousedown);
            $container.on('mouseup' + eventNamespace, module.event.mouseup);
            $container.on('touchend' + eventNamespace, module.event.mouseup);
            $container.on('mouseover' + eventNamespace, module.event.mouseover);
            if ($input.length) {
              $input.on('input' + eventNamespace, module.event.inputChange);
              $input.on('focus' + eventNamespace, module.event.inputFocus);
              $input.on('blur' + eventNamespace, module.event.inputBlur);
              $input.on('click' + eventNamespace, module.event.inputClick);
              $input.on('keydown' + eventNamespace, module.event.keydown);
            } else {
              $container.on('keydown' + eventNamespace, module.event.keydown);
            }
          }
        },

        unbind: {
          events: function () {
            module.debug('Unbinding events');
            $container.off(eventNamespace);
            if ($input.length) {
              $input.off(eventNamespace);
            }
          }
        },

        event: {
          mouseover: function (event) {
            var target = $(event.target);
            var date = target.data(metadata.date);
            var mousedown = event.buttons === 1;
            if (date) {
              module.set.focusDate(date, false, true, mousedown);
            }
          },
          mousedown: function (event) {
            if ($input.length) {
              //prevent the mousedown on the calendar causing the input to lose focus
              event.preventDefault();
            }
            isTouchDown = event.type.indexOf('touch') >= 0;
            var target = $(event.target);
            var date = target.data(metadata.date);
            if (date) {
              module.set.focusDate(date, false, true, true);
            }
          },
          mouseup: function (event) {
            //ensure input has focus so that it receives keydown events for calendar navigation
            module.focus();
            event.preventDefault();
            event.stopPropagation();
            isTouchDown = false;
            var target = $(event.target);
            if (target.hasClass("disabled")) {
              return;
            }
            var parent = target.parent();
            if (parent.data(metadata.date) || parent.data(metadata.focusDate) || parent.data(metadata.mode)) {
              //clicked on a child element, switch to parent (used when clicking directly on prev/next <i> icon element)
              target = parent;
            }
            var date = target.data(metadata.date);
            var focusDate = target.data(metadata.focusDate);
            var mode = target.data(metadata.mode);
            if (date && settings.onSelect.call(element, date, module.get.mode()) !== false) {
              var forceSet = target.hasClass(className.today);
              module.selectDate(date, forceSet);
            }
            else if (focusDate) {
              module.set.focusDate(focusDate);
            }
            else if (mode) {
              module.set.mode(mode);
            }
          },
          keydown: function (event) {
            var keyCode = event.which;
            if (keyCode === 27 || keyCode === 9) {
              //esc || tab
              module.popup('hide');
            }

            if (module.popup('is visible')) {
              if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
                //arrow keys
                var mode = module.get.mode();
                var bigIncrement = mode === 'day' ? 7 : mode === 'hour' ? 4 : mode === 'minute' ? timeGap['column'] : 3;
                var increment = keyCode === 37 ? -1 : keyCode === 38 ? -bigIncrement : keyCode == 39 ? 1 : bigIncrement;
                increment *= mode === 'minute' ? settings.minTimeGap : 1;
                var focusDate = module.get.focusDate() || module.get.date() || new Date();
                var year = focusDate.getFullYear() + (mode === 'year' ? increment : 0);
                var month = focusDate.getMonth() + (mode === 'month' ? increment : 0);
                var day = focusDate.getDate() + (mode === 'day' ? increment : 0);
                var hour = focusDate.getHours() + (mode === 'hour' ? increment : 0);
                var minute = focusDate.getMinutes() + (mode === 'minute' ? increment : 0);
                var newFocusDate = new Date(year, month, day, hour, minute);
                if (settings.type === 'time') {
                  newFocusDate = module.helper.mergeDateTime(focusDate, newFocusDate);
                }
                if (module.helper.isDateInRange(newFocusDate, mode)) {
                  module.set.focusDate(newFocusDate);
                }
              } else if (keyCode === 13) {
                //enter
                var mode = module.get.mode();
                var date = module.get.focusDate();
                if (date && !settings.isDisabled(date, mode) && !module.helper.isDisabled(date, mode) && module.helper.isEnabled(date, mode)) {
                  module.selectDate(date);
                }
                //disable form submission:
                event.preventDefault();
                event.stopPropagation();
              }
            }

            if (keyCode === 38 || keyCode === 40) {
              //arrow-up || arrow-down
              event.preventDefault(); //don't scroll
              module.popup('show');
            }
          },
          inputChange: function () {
            var val = $input.val();
            var date = parser.date(val, settings);
            module.set.date(date, false);
          },
          inputFocus: function () {
            $container.addClass(className.active);
          },
          inputBlur: function () {
            $container.removeClass(className.active);
            if (settings.formatInput) {
              var date = module.get.date();
              var text = formatter.datetime(date, settings);
              $input.val(text);
            }
          },
          inputClick: function () {
            module.popup('show');
          }
        },

        get: {
          weekOfYear: function(weekYear,weekMonth,weekDay) {
              // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
              var ms1d = 864e5, // milliseconds in a day
                  ms7d = 7 * ms1d; // milliseconds in a week

              return function() { // return a closure so constants get calculated only once
                  var DC3 = Date.UTC(weekYear, weekMonth, weekDay + 3) / ms1d, // an Absolute Day Number
                      AWN = Math.floor(DC3 / 7), // an Absolute Week Number
                      Wyr = new Date(AWN * ms7d).getUTCFullYear();

                  return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
              }();
          },
          date: function () {
            return module.helper.sanitiseDate($module.data(metadata.date)) || null;
          },
          inputDate: function() {
            return $input.val();
          },
          focusDate: function () {
            return $module.data(metadata.focusDate) || null;
          },
          startDate: function () {
            var startModule = module.get.calendarModule(settings.startCalendar);
            return (startModule ? startModule.get.date() : $module.data(metadata.startDate)) || null;
          },
          endDate: function () {
            var endModule = module.get.calendarModule(settings.endCalendar);
            return (endModule ? endModule.get.date() : $module.data(metadata.endDate)) || null;
          },
          minDate: function() {
            return $module.data(metadata.minDate) || null;
          },
          maxDate: function() {
            return $module.data(metadata.maxDate) || null;
          },
          monthOffset: function () {
            return $module.data(metadata.monthOffset) || 0;
          },
          mode: function () {
            //only returns valid modes for the current settings
            var mode = $module.data(metadata.mode) || settings.startMode;
            var validModes = module.get.validModes();
            if ($.inArray(mode, validModes) >= 0) {
              return mode;
            }
            return settings.type === 'time' ? 'hour' :
              settings.type === 'month' ? 'month' :
                settings.type === 'year' ? 'year' : 'day';
          },
          validModes: function () {
            var validModes = [];
            if (settings.type !== 'time') {
              if (!settings.disableYear || settings.type === 'year') {
                validModes.push('year');
              }
              if (!(settings.disableMonth || settings.type === 'year') || settings.type === 'month') {
                validModes.push('month');
              }
              if (settings.type.indexOf('date') >= 0) {
                validModes.push('day');
              }
            }
            if (settings.type.indexOf('time') >= 0) {
              validModes.push('hour');
              if (!settings.disableMinute) {
                validModes.push('minute');
              }
            }
            return validModes;
          },
          isTouch: function () {
            try {
              document.createEvent('TouchEvent');
              return true;
            }
            catch (e) {
              return false;
            }
          },
          calendarModule: function (selector) {
            if (!selector) {
              return null;
            }
            if (!(selector instanceof $)) {
              selector = $(selector).first();
            }
            //assume range related calendars are using the same namespace
            return selector.data(moduleNamespace);
          }
        },

        set: {
          date: function (date, updateInput, fireChange) {
            updateInput = updateInput !== false;
            fireChange = fireChange !== false;
            date = module.helper.sanitiseDate(date);
            date = module.helper.dateInRange(date);

            var mode = module.get.mode();
            var text = formatter.datetime(date, settings);
            if (fireChange && settings.onChange.call(element, date, text, mode) === false) {
              return false;
            }

            module.set.focusDate(date);

            if (settings.isDisabled(date, mode)) {
              return false;
            }

            var endDate = module.get.endDate();
            if (!!endDate && !!date && date > endDate) {
              //selected date is greater than end date in range, so clear end date
              module.set.endDate(undefined);
            }
            module.set.dataKeyValue(metadata.date, date);

            if (updateInput && $input.length) {
              $input.val(text);
            }
          },
          startDate: function (date, refreshCalendar) {
            date = module.helper.sanitiseDate(date);
            var startModule = module.get.calendarModule(settings.startCalendar);
            if (startModule) {
              startModule.set.date(date);
            }
            module.set.dataKeyValue(metadata.startDate, date, refreshCalendar);
          },
          endDate: function (date, refreshCalendar) {
            date = module.helper.sanitiseDate(date);
            var endModule = module.get.calendarModule(settings.endCalendar);
            if (endModule) {
              endModule.set.date(date);
            }
            module.set.dataKeyValue(metadata.endDate, date, refreshCalendar);
          },
          focusDate: function (date, refreshCalendar, updateFocus, updateRange) {
            date = module.helper.sanitiseDate(date);
            date = module.helper.dateInRange(date);
            var isDay = module.get.mode() === 'day';
            var oldFocusDate = module.get.focusDate();
            if (isDay && date && oldFocusDate) {
              var yearDelta = date.getFullYear() - oldFocusDate.getFullYear();
              var monthDelta = yearDelta * 12 + date.getMonth() - oldFocusDate.getMonth();
              if (monthDelta) {
                var monthOffset = module.get.monthOffset() - monthDelta;
                module.set.monthOffset(monthOffset, false);
              }
            }
            var changed = module.set.dataKeyValue(metadata.focusDate, date, refreshCalendar);
            updateFocus = (updateFocus !== false && changed && refreshCalendar === false) || focusDateUsedForRange != updateRange;
            focusDateUsedForRange = updateRange;
            if (updateFocus) {
              module.update.focus(updateRange);
            }
          },
          minDate: function (date) {
            date = module.helper.sanitiseDate(date);
            if (settings.maxDate !== null && settings.maxDate <= date) {
              module.verbose('Unable to set minDate variable bigger that maxDate variable', date, settings.maxDate);
            } else {
              module.setting('minDate', date);
              module.set.dataKeyValue(metadata.minDate, date);
            }
          },
          maxDate: function (date) {
            date = module.helper.sanitiseDate(date);
            if (settings.minDate !== null && settings.minDate >= date) {
              module.verbose('Unable to set maxDate variable lower that minDate variable', date, settings.minDate);
            } else {
              module.setting('maxDate', date);
              module.set.dataKeyValue(metadata.maxDate, date);
            }
          },
          monthOffset: function (monthOffset, refreshCalendar) {
            var multiMonth = Math.max(settings.multiMonth, 1);
            monthOffset = Math.max(1 - multiMonth, Math.min(0, monthOffset));
            module.set.dataKeyValue(metadata.monthOffset, monthOffset, refreshCalendar);
          },
          mode: function (mode, refreshCalendar) {
            module.set.dataKeyValue(metadata.mode, mode, refreshCalendar);
          },
          dataKeyValue: function (key, value, refreshCalendar) {
            var oldValue = $module.data(key);
            var equal = oldValue === value || (oldValue <= value && oldValue >= value); //equality test for dates and string objects
            if (value) {
              $module.data(key, value);
            } else {
              $module.removeData(key);
            }
            refreshCalendar = refreshCalendar !== false && !equal;
            if (refreshCalendar) {
              module.refresh();
            }
            return !equal;
          }
        },

        selectDate: function (date, forceSet) {
          module.verbose('New date selection', date);
          var mode = module.get.mode();
          var complete = forceSet || mode === 'minute' ||
            (settings.disableMinute && mode === 'hour') ||
            (settings.type === 'date' && mode === 'day') ||
            (settings.type === 'month' && mode === 'month') ||
            (settings.type === 'year' && mode === 'year');
          if (complete) {
            var canceled = module.set.date(date) === false;
            if (!canceled && settings.closable) {
              module.popup('hide');
              //if this is a range calendar, show the end date calendar popup and focus the input
              var endModule = module.get.calendarModule(settings.endCalendar);
              if (endModule) {
                endModule.popup('show');
                endModule.focus();
              }
            }
          } else {
            var newMode = mode === 'year' ? (!settings.disableMonth ? 'month' : 'day') :
              mode === 'month' ? 'day' : mode === 'day' ? 'hour' : 'minute';
            module.set.mode(newMode);
            if (mode === 'hour' || (mode === 'day' && module.get.date())) {
              //the user has chosen enough to consider a valid date/time has been chosen
              module.set.date(date);
            } else {
              module.set.focusDate(date);
            }
          }
        },

        changeDate: function (date) {
          module.set.date(date);
        },

        clear: function () {
          module.set.date(undefined);
        },

        popup: function () {
          return $activator.popup.apply($activator, arguments);
        },

        focus: function () {
          if ($input.length) {
            $input.focus();
          } else {
            $container.focus();
          }
        },
        blur: function () {
          if ($input.length) {
            $input.blur();
          } else {
            $container.blur();
          }
        },

        helper: {
          isDisabled: function(date, mode) {
            return mode === 'day' && ((settings.disabledDaysOfWeek.indexOf(date.getDay()) !== -1) || settings.disabledDates.some(function(d){
              if(typeof d === 'string') {
                d = module.helper.sanitiseDate(d);
              }
              if (d instanceof Date) {
                return module.helper.dateEqual(date, d, mode);
              }
              if (d !== null && typeof d === 'object' && d[metadata.date]) {
                return module.helper.dateEqual(date, module.helper.sanitiseDate(d[metadata.date]), mode);
              }
            }));
          },
          isEnabled: function(date, mode) {
            if (mode === 'day') {
              return settings.enabledDates.length === 0 || settings.enabledDates.some(function(d){
                if(typeof d === 'string') {
                  d = module.helper.sanitiseDate(d);
                }
                if (d instanceof Date) {
                  return module.helper.dateEqual(date, d, mode);
                }
                if (d !== null && typeof d === 'object' && d[metadata.date]) {
                  return module.helper.dateEqual(date, module.helper.sanitiseDate(d[metadata.date]), mode);
                }
              });
            } else {
              return true;
            }
          },
          findDayAsObject: function(date, mode, dates) {
            if (mode === 'day') {
              var i = 0, il = dates.length;
              var d;
              for (; i < il; i++) {
                d = dates[i];
                if(typeof d === 'string') {
                  d = module.helper.sanitiseDate(d);
                }
                if (d instanceof Date && module.helper.dateEqual(date, d, mode)) {
                  var dateObject = {};
                  dateObject[metadata.date] = d;
                  return dateObject;
                }
                else if (d !== null && typeof d === 'object' && d[metadata.date] && module.helper.dateEqual(date,module.helper.sanitiseDate(d[metadata.date]), mode)  ) {
                  return d;
                }
              }
            }
            return null;
          },
          sanitiseDate: function (date) {
            if (!date) {
              return undefined;
            }
            if (!(date instanceof Date)) {
              date = parser.date('' + date, settings);
            }
            if (!date || date === null || isNaN(date.getTime())) {
              return undefined;
            }
            return date;
          },
          dateDiff: function (date1, date2, mode) {
            mode = mode || 'day';
            var isTimeOnly = settings.type === 'time';
            var isYear = mode === 'year';
            var isYearOrMonth = isYear || mode === 'month';
            var isMinute = mode === 'minute';
            var isHourOrMinute = isMinute || mode === 'hour';
            //only care about a minute accuracy of settings.minTimeGap
            date1 = new Date(
              isTimeOnly ? 2000 : date1.getFullYear(),
              isTimeOnly ? 0 : isYear ? 0 : date1.getMonth(),
              isTimeOnly ? 1 : isYearOrMonth ? 1 : date1.getDate(),
              !isHourOrMinute ? 0 : date1.getHours(),
              !isMinute ? 0 : settings.minTimeGap * Math.floor(date1.getMinutes() / settings.minTimeGap));
            date2 = new Date(
              isTimeOnly ? 2000 : date2.getFullYear(),
              isTimeOnly ? 0 : isYear ? 0 : date2.getMonth(),
              isTimeOnly ? 1 : isYearOrMonth ? 1 : date2.getDate(),
              !isHourOrMinute ? 0 : date2.getHours(),
              !isMinute ? 0 : settings.minTimeGap * Math.floor(date2.getMinutes() / settings.minTimeGap));
            return date2.getTime() - date1.getTime();
          },
          dateEqual: function (date1, date2, mode) {
            return !!date1 && !!date2 && module.helper.dateDiff(date1, date2, mode) === 0;
          },
          isDateInRange: function (date, mode, minDate, maxDate) {
            if (!minDate && !maxDate) {
              var startDate = module.get.startDate();
              minDate = startDate && settings.minDate ? new Date(Math.max(startDate, settings.minDate)) : startDate || settings.minDate;
              maxDate = settings.maxDate;
            }
            minDate = minDate && new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), minDate.getHours(), settings.minTimeGap * Math.ceil(minDate.getMinutes() / settings.minTimeGap));
            return !(!date ||
            (minDate && module.helper.dateDiff(date, minDate, mode) > 0) ||
            (maxDate && module.helper.dateDiff(maxDate, date, mode) > 0));
          },
          dateInRange: function (date, minDate, maxDate) {
            if (!minDate && !maxDate) {
              var startDate = module.get.startDate();
              minDate = startDate && settings.minDate ? new Date(Math.max(startDate, settings.minDate)) : startDate || settings.minDate;
              maxDate = settings.maxDate;
            }
            minDate = minDate && new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), minDate.getHours(), settings.minTimeGap * Math.ceil(minDate.getMinutes() / settings.minTimeGap));
            var isTimeOnly = settings.type === 'time';
            return !date ? date :
              (minDate && module.helper.dateDiff(date, minDate, 'minute') > 0) ?
                (isTimeOnly ? module.helper.mergeDateTime(date, minDate) : minDate) :
                (maxDate && module.helper.dateDiff(maxDate, date, 'minute') > 0) ?
                  (isTimeOnly ? module.helper.mergeDateTime(date, maxDate) : maxDate) :
                  date;
          },
          mergeDateTime: function (date, time) {
            return (!date || !time) ? time :
              new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
          }
        },

        setting: function (name, value) {
          module.debug('Changing setting', name, value);
          if ($.isPlainObject(name)) {
            $.extend(true, settings, name);
          }
          else if (value !== undefined) {
            if ($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function (name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function () {
          if (!settings.silent && settings.debug) {
            if (settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function () {
          if (!settings.silent && settings.verbose && settings.debug) {
            if (settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function () {
          if (!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function (message) {
            var
              currentTime,
              executionTime,
              previousTime
              ;
            if (settings.performance) {
              currentTime = new Date().getTime();
              previousTime = time || currentTime;
              executionTime = currentTime - previousTime;
              time = currentTime;
              performance.push({
                'Name': message[0],
                'Arguments': [].slice.call(message, 1) || '',
                'Element': element,
                'Execution Time': executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function () {
            var
              title = settings.name + ':',
              totalTime = 0
              ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function (index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if (moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if ((console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if (console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function (index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time'] + 'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function (query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
            ;
          passedArguments = passedArguments || queryArguments;
          context = element || context;
          if (typeof query == 'string' && object !== undefined) {
            query = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function (depth, value) {
              var camelCaseValue = (depth != maxDepth)
                  ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                  : query
                ;
              if ($.isPlainObject(object[camelCaseValue]) && (depth != maxDepth)) {
                object = object[camelCaseValue];
              }
              else if (object[camelCaseValue] !== undefined) {
                found = object[camelCaseValue];
                return false;
              }
              else if ($.isPlainObject(object[value]) && (depth != maxDepth)) {
                object = object[value];
              }
              else if (object[value] !== undefined) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ($.isFunction(found)) {
            response = found.apply(context, passedArguments);
          }
          else if (found !== undefined) {
            response = found;
          }
          if (Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if (returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if (response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if (methodInvoked) {
        if (instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if (instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
    ;
};

$.fn.calendar.settings = {

  name            : 'Calendar',
  namespace       : 'calendar',

  silent: false,
  debug: false,
  verbose: false,
  performance: false,

  type               : 'datetime', // picker type, can be 'datetime', 'date', 'time', 'month', or 'year'
  firstDayOfWeek     : 0,          // day for first day column (0 = Sunday)
  constantHeight     : true,       // add rows to shorter months to keep day calendar height consistent (6 rows)
  today              : false,      // show a 'today/now' button at the bottom of the calendar
  closable           : true,       // close the popup after selecting a date/time
  monthFirst         : true,       // month before day when parsing/converting date from/to text
  touchReadonly      : true,       // set input to readonly on touch devices
  inline             : false,      // create the calendar inline instead of inside a popup
  on                 : null,       // when to show the popup (defaults to 'focus' for input, 'click' for others)
  initialDate        : null,       // date to display initially when no date is selected (null = now)
  startMode          : false,      // display mode to start in, can be 'year', 'month', 'day', 'hour', 'minute' (false = 'day')
  minDate            : null,       // minimum date/time that can be selected, dates/times before are disabled
  maxDate            : null,       // maximum date/time that can be selected, dates/times after are disabled
  ampm               : true,       // show am/pm in time mode
  disableYear        : false,      // disable year selection mode
  disableMonth       : false,      // disable month selection mode
  disableMinute      : false,      // disable minute selection mode
  formatInput        : true,       // format the input text upon input blur and module creation
  startCalendar      : null,       // jquery object or selector for another calendar that represents the start date of a date range
  endCalendar        : null,       // jquery object or selector for another calendar that represents the end date of a date range
  multiMonth         : 1,          // show multiple months when in 'day' mode
  minTimeGap         : 5,
  showWeekNumbers    : null,       // show Number of Week at the very first column of a dayView
  disabledDates      : [],         // specific day(s) which won't be selectable and contain additional information.
  disabledDaysOfWeek : [],         // day(s) which won't be selectable(s) (0 = Sunday)
  enabledDates       : [],         // specific day(s) which will be selectable, all other days will be disabled
  eventDates         : [],         // specific day(s) which will be shown in a different color and using tooltips
  centuryBreak       : 60,         // starting short year until 99 where it will be assumed to belong to the last century
  currentCentury     : 2000,       // century to be added to 2-digit years (00 to {centuryBreak}-1)
  selectAdjacentDays : false,     // The calendar can show dates from adjacent month. These adjacent month dates can also be made selectable.
  // popup options ('popup', 'on', 'hoverable', and show/hide callbacks are overridden)
  popupOptions: {
    position: 'bottom left',
    lastResort: 'bottom left',
    prefer: 'opposite',
    hideOnScroll: false
  },

  text: {
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    now: 'Now',
    am: 'AM',
    pm: 'PM',
    weekNo: 'Week'
  },

  formatter: {
    header: function (date, mode, settings) {
      return mode === 'year' ? settings.formatter.yearHeader(date, settings) :
        mode === 'month' ? settings.formatter.monthHeader(date, settings) :
          mode === 'day' ? settings.formatter.dayHeader(date, settings) :
            mode === 'hour' ? settings.formatter.hourHeader(date, settings) :
              settings.formatter.minuteHeader(date, settings);
    },
    yearHeader: function (date, settings) {
      var decadeYear = Math.ceil(date.getFullYear() / 10) * 10;
      return (decadeYear - 9) + ' - ' + (decadeYear + 2);
    },
    monthHeader: function (date, settings) {
      return date.getFullYear();
    },
    dayHeader: function (date, settings) {
      var month = settings.text.months[date.getMonth()];
      var year = date.getFullYear();
      return month + ' ' + year;
    },
    hourHeader: function (date, settings) {
      return settings.formatter.date(date, settings);
    },
    minuteHeader: function (date, settings) {
      return settings.formatter.date(date, settings);
    },
    dayColumnHeader: function (day, settings) {
      return settings.text.days[day];
    },
    datetime: function (date, settings) {
      if (!date) {
        return '';
      }
      var day = settings.type === 'time' ? '' : settings.formatter.date(date, settings);
      var time = settings.type.indexOf('time') < 0 ? '' : settings.formatter.time(date, settings, false);
      var separator = settings.type === 'datetime' ? ' ' : '';
      return day + separator + time;
    },
    date: function (date, settings) {
      if (!date) {
        return '';
      }
      var day = date.getDate();
      var month = settings.text.months[date.getMonth()];
      var year = date.getFullYear();
      return settings.type === 'year' ? year :
        settings.type === 'month' ? month + ' ' + year :
        (settings.monthFirst ? month + ' ' + day : day + ' ' + month) + ', ' + year;
    },
    time: function (date, settings, forCalendar) {
      if (!date) {
        return '';
      }
      var hour = date.getHours();
      var minute = date.getMinutes();
      var ampm = '';
      if (settings.ampm) {
        ampm = ' ' + (hour < 12 ? settings.text.am : settings.text.pm);
        hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      }
      return hour + ':' + (minute < 10 ? '0' : '') + minute + ampm;
    },
    today: function (settings) {
      return settings.type === 'date' ? settings.text.today : settings.text.now;
    },
    cell: function (cell, date, cellOptions) {
    }
  },

  parser: {
    date: function (text, settings) {
      if (text instanceof Date) {
        return text;
      }
      if (!text) {
        return null;
      }
      text = ('' + text).trim().toLowerCase();
      if (text.length === 0) {
        return null;
      }
      var textDate = new Date(text);
      if(!isNaN(textDate.getDate())) {
        return textDate;
      }

      var i, j, k;
      var minute = -1, hour = -1, day = -1, month = -1, year = -1;
      var isAm = undefined;

      var isTimeOnly = settings.type === 'time';
      var isDateOnly = settings.type.indexOf('time') < 0;

      var words = text.split(settings.regExp.dateWords);
      var numbers = text.split(settings.regExp.dateNumbers);

      if (!isDateOnly) {
        //am/pm
        isAm = $.inArray(settings.text.am.toLowerCase(), words) >= 0 ? true :
          $.inArray(settings.text.pm.toLowerCase(), words) >= 0 ? false : undefined;

        //time with ':'
        for (i = 0; i < numbers.length; i++) {
          var number = numbers[i];
          if (number.indexOf(':') >= 0) {
            if (hour < 0 || minute < 0) {
              var parts = number.split(':');
              for (k = 0; k < Math.min(2, parts.length); k++) {
                j = parseInt(parts[k]);
                if (isNaN(j)) {
                  j = 0;
                }
                if (k === 0) {
                  hour = j % 24;
                } else {
                  minute = j % 60;
                }
              }
            }
            numbers.splice(i, 1);
          }
        }
      }

      if (!isTimeOnly) {
        //textual month
        for (i = 0; i < words.length; i++) {
          var word = words[i];
          if (word.length <= 0) {
            continue;
          }
          word = word.substring(0, Math.min(word.length, 3));
          for (j = 0; j < settings.text.months.length; j++) {
            var monthString = settings.text.months[j];
            monthString = monthString.substring(0, Math.min(word.length, Math.min(monthString.length, 3))).toLowerCase();
            if (monthString === word) {
              month = j + 1;
              break;
            }
          }
          if (month >= 0) {
            break;
          }
        }

        //year > settings.centuryBreak
        for (i = 0; i < numbers.length; i++) {
          j = parseInt(numbers[i]);
          if (isNaN(j)) {
            continue;
          }
          if (j >= settings.centuryBreak && i === numbers.length-1) {
            if (j <= 99) {
              j += settings.currentCentury - 100;
            }
            year = j;
            numbers.splice(i, 1);
            break;
          }
        }

        //numeric month
        if (month < 0) {
          for (i = 0; i < numbers.length; i++) {
            k = i > 1 || settings.monthFirst ? i : i === 1 ? 0 : 1;
            j = parseInt(numbers[k]);
            if (isNaN(j)) {
              continue;
            }
            if (1 <= j && j <= 12) {
              month = j;
              numbers.splice(k, 1);
              break;
            }
          }
        }

        //day
        for (i = 0; i < numbers.length; i++) {
          j = parseInt(numbers[i]);
          if (isNaN(j)) {
            continue;
          }
          if (1 <= j && j <= 31) {
            day = j;
            numbers.splice(i, 1);
            break;
          }
        }

        //year <= settings.centuryBreak
        if (year < 0) {
          for (i = numbers.length - 1; i >= 0; i--) {
            j = parseInt(numbers[i]);
            if (isNaN(j)) {
              continue;
            }
            if (j <= 99) {
              j += settings.currentCentury;
            }
            year = j;
            numbers.splice(i, 1);
            break;
          }
        }
      }

      if (!isDateOnly) {
        //hour
        if (hour < 0) {
          for (i = 0; i < numbers.length; i++) {
            j = parseInt(numbers[i]);
            if (isNaN(j)) {
              continue;
            }
            if (0 <= j && j <= 23) {
              hour = j;
              numbers.splice(i, 1);
              break;
            }
          }
        }

        //minute
        if (minute < 0) {
          for (i = 0; i < numbers.length; i++) {
            j = parseInt(numbers[i]);
            if (isNaN(j)) {
              continue;
            }
            if (0 <= j && j <= 59) {
              minute = j;
              numbers.splice(i, 1);
              break;
            }
          }
        }
      }

      if (minute < 0 && hour < 0 && day < 0 && month < 0 && year < 0) {
        return null;
      }

      if (minute < 0) {
        minute = 0;
      }
      if (hour < 0) {
        hour = 0;
      }
      if (day < 0) {
        day = 1;
      }
      if (month < 0) {
        month = 1;
      }
      if (year < 0) {
        year = new Date().getFullYear();
      }

      if (isAm !== undefined) {
        if (isAm) {
          if (hour === 12) {
            hour = 0;
          }
        } else if (hour < 12) {
          hour += 12;
        }
      }

      var date = new Date(year, month - 1, day, hour, minute);
      if (date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        //month or year don't match up, switch to last day of the month
        date = new Date(year, month, 0, hour, minute);
      }
      return isNaN(date.getTime()) ? null : date;
    }
  },

  // callback when date changes, return false to cancel the change
  onChange: function (date, text, mode) {
    return true;
  },

  // callback before show animation, return false to prevent show
  onShow: function () {
  },

  // callback after show animation
  onVisible: function () {
  },

  // callback before hide animation, return false to prevent hide
  onHide: function () {
  },

  // callback after hide animation
  onHidden: function () {
  },

  // callback before item is selected, return false to prevent selection
  onSelect: function (date, mode) {
  },

  // is the given date disabled?
  isDisabled: function (date, mode) {
    return false;
  },

  selector: {
    popup: '.ui.popup',
    input: 'input',
    activator: 'input',
    append: '.inline.field,.inline.fields'
  },

  regExp: {
    dateWords: /[^A-Za-z\u00C0-\u024F]+/g,
    dateNumbers: /[^\d:]+/g
  },

  error: {
    popup: 'UI Popup, a required component is not included in this page',
    method: 'The method you called is not defined.'
  },

  className: {
    calendar: 'calendar',
    active: 'active',
    popup: 'ui popup',
    grid: 'ui equal width grid',
    column: 'column',
    table: 'ui celled center aligned unstackable table',
    prev: 'prev link',
    next: 'next link',
    prevIcon: 'chevron left icon',
    nextIcon: 'chevron right icon',
    link: 'link',
    cell: 'link',
    disabledCell: 'disabled',
    weekCell: 'disabled',
    adjacentCell: 'adjacent',
    activeCell: 'active',
    rangeCell: 'range',
    focusCell: 'focus',
    todayCell: 'today',
    today: 'today link'
  },

  metadata: {
    date: 'date',
    focusDate: 'focusDate',
    startDate: 'startDate',
    endDate: 'endDate',
    minDate: 'minDate',
    maxDate: 'maxDate',
    mode: 'mode',
    monthOffset: 'monthOffset',
    message: 'message',
    class: 'class'
  },

  eventClass: 'blue'
};

})(jQuery, window, document);

/*!
 * # Fomantic-UI - Checkbox
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.checkbox = function(parameters) {
  var
    $allModules    = $(this),
    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = $.extend(true, {}, $.fn.checkbox.settings, parameters),

        className       = settings.className,
        namespace       = settings.namespace,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $label          = $(this).children(selector.label),
        $input          = $(this).children(selector.input),
        input           = $input[0],

        initialLoad     = false,
        shortcutPressed = false,
        instance        = $module.data(moduleNamespace),

        observer,
        element         = this,
        module
      ;

      module      = {

        initialize: function() {
          module.verbose('Initializing checkbox', settings);

          module.create.label();
          module.bind.events();

          module.set.tabbable();
          module.hide.input();

          module.observeChanges();
          module.instantiate();
          module.setup();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying module');
          module.unbind.events();
          module.show.input();
          $module.removeData(moduleNamespace);
        },

        fix: {
          reference: function() {
            if( $module.is(selector.input) ) {
              module.debug('Behavior called on <input> adjusting invoked element');
              $module = $module.closest(selector.checkbox);
              module.refresh();
            }
          }
        },

        setup: function() {
          module.set.initialLoad();
          if( module.is.indeterminate() ) {
            module.debug('Initial value is indeterminate');
            module.indeterminate();
          }
          else if( module.is.checked() ) {
            module.debug('Initial value is checked');
            module.check();
          }
          else {
            module.debug('Initial value is unchecked');
            module.uncheck();
          }
          module.remove.initialLoad();
        },

        refresh: function() {
          $label = $module.children(selector.label);
          $input = $module.children(selector.input);
          input  = $input[0];
        },

        hide: {
          input: function() {
            module.verbose('Modifying <input> z-index to be unselectable');
            $input.addClass(className.hidden);
          }
        },
        show: {
          input: function() {
            module.verbose('Modifying <input> z-index to be selectable');
            $input.removeClass(className.hidden);
          }
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, updating selector cache');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        attachEvents: function(selector, event) {
          var
            $element = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($element.length > 0) {
            module.debug('Attaching checkbox events to element', selector, event);
            $element
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound);
          }
        },

        preventDefaultOnInputTarget: function() {
          if(typeof event !== 'undefined' && $(event.target).is(selector.input)) {
            module.verbose('Preventing default check action after manual check action');
            event.preventDefault();
          }
        },

        event: {
          change: function(event) {
            if( !module.should.ignoreCallbacks() ) {
              settings.onChange.call(input);
            }
          },
          click: function(event) {
            var
              $target = $(event.target)
            ;
            if( $target.is(selector.input) ) {
              module.verbose('Using default check action on initialized checkbox');
              return;
            }
            if( $target.is(selector.link) ) {
              module.debug('Clicking link inside checkbox, skipping toggle');
              return;
            }
            module.toggle();
            $input.focus();
            event.preventDefault();
          },
          keydown: function(event) {
            var
              key     = event.which,
              keyCode = {
                enter  : 13,
                space  : 32,
                escape : 27,
                left   : 37,
                up     : 38,
                right  : 39,
                down   : 40
              }
            ;

            var r = module.get.radios(),
                rIndex = r.index($module),
                rLen = r.length,
                checkIndex = false;

            if(key == keyCode.left || key == keyCode.up) {
              checkIndex = (rIndex === 0 ? rLen : rIndex) - 1;
            } else if(key == keyCode.right || key == keyCode.down) {
              checkIndex = rIndex === rLen-1 ? 0 : rIndex+1;
            }

            if (!module.should.ignoreCallbacks() && checkIndex !== false) {
              if(settings.beforeUnchecked.apply(input)===false) {
                module.verbose('Option not allowed to be unchecked, cancelling key navigation');
                return false;
              }
              if (settings.beforeChecked.apply($(r[checkIndex]).children(selector.input)[0])===false) {
                module.verbose('Next option should not allow check, cancelling key navigation');
                return false;
              }
            }

            if(key == keyCode.escape) {
              module.verbose('Escape key pressed blurring field');
              $input.blur();
              shortcutPressed = true;
            }
            else if(!event.ctrlKey && ( key == keyCode.space || key == keyCode.enter) ) {
              module.verbose('Enter/space key pressed, toggling checkbox');
              module.toggle();
              shortcutPressed = true;
            }
            else {
              shortcutPressed = false;
            }
          },
          keyup: function(event) {
            if(shortcutPressed) {
              event.preventDefault();
            }
          }
        },

        check: function() {
          if( !module.should.allowCheck() ) {
            return;
          }
          module.debug('Checking checkbox', $input);
          module.set.checked();
          if( !module.should.ignoreCallbacks() ) {
            settings.onChecked.call(input);
            module.trigger.change();
          }
          module.preventDefaultOnInputTarget();
        },

        uncheck: function() {
          if( !module.should.allowUncheck() ) {
            return;
          }
          module.debug('Unchecking checkbox');
          module.set.unchecked();
          if( !module.should.ignoreCallbacks() ) {
            settings.onUnchecked.call(input);
            module.trigger.change();
          }
          module.preventDefaultOnInputTarget();
        },

        indeterminate: function() {
          if( module.should.allowIndeterminate() ) {
            module.debug('Checkbox is already indeterminate');
            return;
          }
          module.debug('Making checkbox indeterminate');
          module.set.indeterminate();
          if( !module.should.ignoreCallbacks() ) {
            settings.onIndeterminate.call(input);
            module.trigger.change();
          }
        },

        determinate: function() {
          if( module.should.allowDeterminate() ) {
            module.debug('Checkbox is already determinate');
            return;
          }
          module.debug('Making checkbox determinate');
          module.set.determinate();
          if( !module.should.ignoreCallbacks() ) {
            settings.onDeterminate.call(input);
            module.trigger.change();
          }
        },

        enable: function() {
          if( module.is.enabled() ) {
            module.debug('Checkbox is already enabled');
            return;
          }
          module.debug('Enabling checkbox');
          module.set.enabled();
          if( !module.should.ignoreCallbacks() ) {
            settings.onEnable.call(input);
            // preserve legacy callbacks
            settings.onEnabled.call(input);
            module.trigger.change();
          }
        },

        disable: function() {
          if( module.is.disabled() ) {
            module.debug('Checkbox is already disabled');
            return;
          }
          module.debug('Disabling checkbox');
          module.set.disabled();
          if( !module.should.ignoreCallbacks() ) {
            settings.onDisable.call(input);
            // preserve legacy callbacks
            settings.onDisabled.call(input);
            module.trigger.change();
          }
        },

        get: {
          radios: function() {
            var
              name = module.get.name()
            ;
            return $('input[name="' + name + '"]').closest(selector.checkbox);
          },
          otherRadios: function() {
            return module.get.radios().not($module);
          },
          name: function() {
            return $input.attr('name');
          }
        },

        is: {
          initialLoad: function() {
            return initialLoad;
          },
          radio: function() {
            return ($input.hasClass(className.radio) || $input.attr('type') == 'radio');
          },
          indeterminate: function() {
            return $input.prop('indeterminate') !== undefined && $input.prop('indeterminate');
          },
          checked: function() {
            return $input.prop('checked') !== undefined && $input.prop('checked');
          },
          disabled: function() {
            return $input.prop('disabled') !== undefined && $input.prop('disabled');
          },
          enabled: function() {
            return !module.is.disabled();
          },
          determinate: function() {
            return !module.is.indeterminate();
          },
          unchecked: function() {
            return !module.is.checked();
          }
        },

        should: {
          allowCheck: function() {
            if(module.is.determinate() && module.is.checked() && !module.is.initialLoad() ) {
              module.debug('Should not allow check, checkbox is already checked');
              return false;
            }
            if(!module.should.ignoreCallbacks() && settings.beforeChecked.apply(input) === false) {
              module.debug('Should not allow check, beforeChecked cancelled');
              return false;
            }
            return true;
          },
          allowUncheck: function() {
            if(module.is.determinate() && module.is.unchecked() && !module.is.initialLoad() ) {
              module.debug('Should not allow uncheck, checkbox is already unchecked');
              return false;
            }
            if(!module.should.ignoreCallbacks() && settings.beforeUnchecked.apply(input) === false) {
              module.debug('Should not allow uncheck, beforeUnchecked cancelled');
              return false;
            }
            return true;
          },
          allowIndeterminate: function() {
            if(module.is.indeterminate() && !module.is.initialLoad() ) {
              module.debug('Should not allow indeterminate, checkbox is already indeterminate');
              return false;
            }
            if(!module.should.ignoreCallbacks() && settings.beforeIndeterminate.apply(input) === false) {
              module.debug('Should not allow indeterminate, beforeIndeterminate cancelled');
              return false;
            }
            return true;
          },
          allowDeterminate: function() {
            if(module.is.determinate() && !module.is.initialLoad() ) {
              module.debug('Should not allow determinate, checkbox is already determinate');
              return false;
            }
            if(!module.should.ignoreCallbacks() && settings.beforeDeterminate.apply(input) === false) {
              module.debug('Should not allow determinate, beforeDeterminate cancelled');
              return false;
            }
            return true;
          },
          ignoreCallbacks: function() {
            return (initialLoad && !settings.fireOnInit);
          }
        },

        can: {
          change: function() {
            return !( $module.hasClass(className.disabled) || $module.hasClass(className.readOnly) || $input.prop('disabled') || $input.prop('readonly') );
          },
          uncheck: function() {
            return (typeof settings.uncheckable === 'boolean')
              ? settings.uncheckable
              : !module.is.radio()
            ;
          }
        },

        set: {
          initialLoad: function() {
            initialLoad = true;
          },
          checked: function() {
            module.verbose('Setting class to checked');
            $module
              .removeClass(className.indeterminate)
              .addClass(className.checked)
            ;
            if( module.is.radio() ) {
              module.uncheckOthers();
            }
            if(!module.is.indeterminate() && module.is.checked()) {
              module.debug('Input is already checked, skipping input property change');
              return;
            }
            module.verbose('Setting state to checked', input);
            $input
              .prop('indeterminate', false)
              .prop('checked', true)
            ;
          },
          unchecked: function() {
            module.verbose('Removing checked class');
            $module
              .removeClass(className.indeterminate)
              .removeClass(className.checked)
            ;
            if(!module.is.indeterminate() &&  module.is.unchecked() ) {
              module.debug('Input is already unchecked');
              return;
            }
            module.debug('Setting state to unchecked');
            $input
              .prop('indeterminate', false)
              .prop('checked', false)
            ;
          },
          indeterminate: function() {
            module.verbose('Setting class to indeterminate');
            $module
              .addClass(className.indeterminate)
            ;
            if( module.is.indeterminate() ) {
              module.debug('Input is already indeterminate, skipping input property change');
              return;
            }
            module.debug('Setting state to indeterminate');
            $input
              .prop('indeterminate', true)
            ;
          },
          determinate: function() {
            module.verbose('Removing indeterminate class');
            $module
              .removeClass(className.indeterminate)
            ;
            if( module.is.determinate() ) {
              module.debug('Input is already determinate, skipping input property change');
              return;
            }
            module.debug('Setting state to determinate');
            $input
              .prop('indeterminate', false)
            ;
          },
          disabled: function() {
            module.verbose('Setting class to disabled');
            $module
              .addClass(className.disabled)
            ;
            if( module.is.disabled() ) {
              module.debug('Input is already disabled, skipping input property change');
              return;
            }
            module.debug('Setting state to disabled');
            $input
              .prop('disabled', 'disabled')
            ;
          },
          enabled: function() {
            module.verbose('Removing disabled class');
            $module.removeClass(className.disabled);
            if( module.is.enabled() ) {
              module.debug('Input is already enabled, skipping input property change');
              return;
            }
            module.debug('Setting state to enabled');
            $input
              .prop('disabled', false)
            ;
          },
          tabbable: function() {
            module.verbose('Adding tabindex to checkbox');
            if( $input.attr('tabindex') === undefined) {
              $input.attr('tabindex', 0);
            }
          }
        },

        remove: {
          initialLoad: function() {
            initialLoad = false;
          }
        },

        trigger: {
          change: function() {
            var
              events       = document.createEvent('HTMLEvents'),
              inputElement = $input[0]
            ;
            if(inputElement) {
              module.verbose('Triggering native change event');
              events.initEvent('change', true, false);
              inputElement.dispatchEvent(events);
            }
          }
        },


        create: {
          label: function() {
            if($input.prevAll(selector.label).length > 0) {
              $input.prev(selector.label).detach().insertAfter($input);
              module.debug('Moving existing label', $label);
            }
            else if( !module.has.label() ) {
              $label = $('<label>').insertAfter($input);
              module.debug('Creating label', $label);
            }
          }
        },

        has: {
          label: function() {
            return ($label.length > 0);
          }
        },

        bind: {
          events: function() {
            module.verbose('Attaching checkbox events');
            $module
              .on('click'   + eventNamespace, module.event.click)
              .on('change'  + eventNamespace, module.event.change)
              .on('keydown' + eventNamespace, selector.input, module.event.keydown)
              .on('keyup'   + eventNamespace, selector.input, module.event.keyup)
            ;
          }
        },

        unbind: {
          events: function() {
            module.debug('Removing events');
            $module
              .off(eventNamespace)
            ;
          }
        },

        uncheckOthers: function() {
          var
            $radios = module.get.otherRadios()
          ;
          module.debug('Unchecking other radios', $radios);
          $radios.removeClass(className.checked);
        },

        toggle: function() {
          if( !module.can.change() ) {
            if(!module.is.radio()) {
              module.debug('Checkbox is read-only or disabled, ignoring toggle');
            }
            return;
          }
          if( module.is.indeterminate() || module.is.unchecked() ) {
            module.debug('Currently unchecked');
            module.check();
          }
          else if( module.is.checked() && module.can.uncheck() ) {
            module.debug('Currently checked');
            module.uncheck();
          }
        },
        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.checkbox.settings = {

  name                : 'Checkbox',
  namespace           : 'checkbox',

  silent              : false,
  debug               : false,
  verbose             : true,
  performance         : true,

  // delegated event context
  uncheckable         : 'auto',
  fireOnInit          : false,

  onChange            : function(){},

  beforeChecked       : function(){},
  beforeUnchecked     : function(){},
  beforeDeterminate   : function(){},
  beforeIndeterminate : function(){},

  onChecked           : function(){},
  onUnchecked         : function(){},

  onDeterminate       : function() {},
  onIndeterminate     : function() {},

  onEnable            : function(){},
  onDisable           : function(){},

  // preserve misspelled callbacks (will be removed in 3.0)
  onEnabled           : function(){},
  onDisabled          : function(){},

  className       : {
    checked       : 'checked',
    indeterminate : 'indeterminate',
    disabled      : 'disabled',
    hidden        : 'hidden',
    radio         : 'radio',
    readOnly      : 'read-only'
  },

  error     : {
    method       : 'The method you called is not defined'
  },

  selector : {
    checkbox : '.ui.checkbox',
    label    : 'label, .box',
    input    : 'input[type="checkbox"], input[type="radio"]',
    link     : 'a[href]'
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Dimmer
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.dimmer = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
          : $.extend({}, $.fn.dimmer.settings),

        selector        = settings.selector,
        namespace       = settings.namespace,
        className       = settings.className,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        clickEvent      = ('ontouchstart' in document.documentElement)
          ? 'touchstart'
          : 'click',

        $module = $(this),
        $dimmer,
        $dimmable,

        element   = this,
        instance  = $module.data(moduleNamespace),
        module
      ;

      module = {

        preinitialize: function() {
          if( module.is.dimmer() ) {

            $dimmable = $module.parent();
            $dimmer   = $module;
          }
          else {
            $dimmable = $module;
            if( module.has.dimmer() ) {
              if(settings.dimmerName) {
                $dimmer = $dimmable.find(selector.dimmer).filter('.' + settings.dimmerName);
              }
              else {
                $dimmer = $dimmable.find(selector.dimmer);
              }
            }
            else {
              $dimmer = module.create();
            }
          }
        },

        initialize: function() {
          module.debug('Initializing dimmer', settings);

          module.bind.events();
          module.set.dimmable();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', $dimmer);
          module.unbind.events();
          module.remove.variation();
          $dimmable
            .off(eventNamespace)
          ;
        },

        bind: {
          events: function() {
            if(settings.on == 'hover') {
              $dimmable
                .on('mouseenter' + eventNamespace, module.show)
                .on('mouseleave' + eventNamespace, module.hide)
              ;
            }
            else if(settings.on == 'click') {
              $dimmable
                .on(clickEvent + eventNamespace, module.toggle)
              ;
            }
            if( module.is.page() ) {
              module.debug('Setting as a page dimmer', $dimmable);
              module.set.pageDimmer();
            }

            if( module.is.closable() ) {
              module.verbose('Adding dimmer close event', $dimmer);
              $dimmable
                .on(clickEvent + eventNamespace, selector.dimmer, module.event.click)
              ;
            }
          }
        },

        unbind: {
          events: function() {
            $module
              .removeData(moduleNamespace)
            ;
            $dimmable
              .off(eventNamespace)
            ;
          }
        },

        event: {
          click: function(event) {
            module.verbose('Determining if event occured on dimmer', event);
            if( $dimmer.find(event.target).length === 0 || $(event.target).is(selector.content) ) {
              module.hide();
              event.stopImmediatePropagation();
            }
          }
        },

        addContent: function(element) {
          var
            $content = $(element)
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $content.detach().appendTo($dimmer);
          }
        },

        create: function() {
          var
            $element = $( settings.template.dimmer(settings) )
          ;
          if(settings.dimmerName) {
            module.debug('Creating named dimmer', settings.dimmerName);
            $element.addClass(settings.dimmerName);
          }
          $element
            .appendTo($dimmable)
          ;
          return $element;
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Showing dimmer', $dimmer, settings);
          module.set.variation();
          if( (!module.is.dimmed() || module.is.animating()) && module.is.enabled() ) {
            module.animate.show(callback);
            settings.onShow.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is already shown or disabled');
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.dimmed() || module.is.animating() ) {
            module.debug('Hiding dimmer', $dimmer);
            module.animate.hide(callback);
            settings.onHide.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is not visible');
          }
        },

        toggle: function() {
          module.verbose('Toggling dimmer visibility', $dimmer);
          if( !module.is.dimmed() ) {
            module.show();
          }
          else {
            if ( module.is.closable() ) {
              module.hide();
            }
          }
        },

        animate: {
          show: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              if(settings.useFlex) {
                module.debug('Using flex dimmer');
                module.remove.legacy();
              }
              else {
                module.debug('Using legacy non-flex dimmer');
                module.set.legacy();
              }
              if(settings.opacity !== 'auto') {
                module.set.opacity();
              }
              $dimmer
                .transition({
                  displayType : settings.useFlex
                    ? 'flex'
                    : 'block',
                  animation   : settings.transition + ' in',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onStart     : function() {
                    module.set.dimmed();
                  },
                  onComplete  : function() {
                    module.set.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Showing dimmer animation with javascript');
              module.set.dimmed();
              if(settings.opacity == 'auto') {
                settings.opacity = 0.8;
              }
              $dimmer
                .stop()
                .css({
                  opacity : 0,
                  width   : '100%',
                  height  : '100%'
                })
                .fadeTo(module.get.duration(), settings.opacity, function() {
                  $dimmer.removeAttr('style');
                  module.set.active();
                  callback();
                })
              ;
            }
          },
          hide: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition({
                  displayType : settings.useFlex
                    ? 'flex'
                    : 'block',
                  animation   : settings.transition + ' out',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onComplete  : function() {
                    module.remove.dimmed();
                    module.remove.variation();
                    module.remove.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Hiding dimmer with javascript');
              $dimmer
                .stop()
                .fadeOut(module.get.duration(), function() {
                  module.remove.dimmed();
                  module.remove.active();
                  $dimmer.removeAttr('style');
                  callback();
                })
              ;
            }
          }
        },

        get: {
          dimmer: function() {
            return $dimmer;
          },
          duration: function() {
            if(typeof settings.duration == 'object') {
              if( module.is.active() ) {
                return settings.duration.hide;
              }
              else {
                return settings.duration.show;
              }
            }
            return settings.duration;
          }
        },

        has: {
          dimmer: function() {
            if(settings.dimmerName) {
              return ($module.find(selector.dimmer).filter('.' + settings.dimmerName).length > 0);
            }
            else {
              return ( $module.find(selector.dimmer).length > 0 );
            }
          }
        },

        is: {
          active: function() {
            return $dimmer.hasClass(className.active);
          },
          animating: function() {
            return ( $dimmer.is(':animated') || $dimmer.hasClass(className.animating) );
          },
          closable: function() {
            if(settings.closable == 'auto') {
              if(settings.on == 'hover') {
                return false;
              }
              return true;
            }
            return settings.closable;
          },
          dimmer: function() {
            return $module.hasClass(className.dimmer);
          },
          dimmable: function() {
            return $module.hasClass(className.dimmable);
          },
          dimmed: function() {
            return $dimmable.hasClass(className.dimmed);
          },
          disabled: function() {
            return $dimmable.hasClass(className.disabled);
          },
          enabled: function() {
            return !module.is.disabled();
          },
          page: function () {
            return $dimmable.is('body');
          },
          pageDimmer: function() {
            return $dimmer.hasClass(className.pageDimmer);
          }
        },

        can: {
          show: function() {
            return !$dimmer.hasClass(className.disabled);
          }
        },

        set: {
          opacity: function(opacity) {
            var
              color      = $dimmer.css('background-color'),
              colorArray = color.split(','),
              isRGB      = (colorArray && colorArray.length == 3),
              isRGBA     = (colorArray && colorArray.length == 4)
            ;
            opacity    = settings.opacity === 0 ? 0 : settings.opacity || opacity;
            if(isRGB || isRGBA) {
              colorArray[3] = opacity + ')';
              color         = colorArray.join(',');
            }
            else {
              color = 'rgba(0, 0, 0, ' + opacity + ')';
            }
            module.debug('Setting opacity to', opacity);
            $dimmer.css('background-color', color);
          },
          legacy: function() {
            $dimmer.addClass(className.legacy);
          },
          active: function() {
            $dimmer.addClass(className.active);
          },
          dimmable: function() {
            $dimmable.addClass(className.dimmable);
          },
          dimmed: function() {
            $dimmable.addClass(className.dimmed);
          },
          pageDimmer: function() {
            $dimmer.addClass(className.pageDimmer);
          },
          disabled: function() {
            $dimmer.addClass(className.disabled);
          },
          variation: function(variation) {
            variation = variation || settings.variation;
            if(variation) {
              $dimmer.addClass(variation);
            }
          }
        },

        remove: {
          active: function() {
            $dimmer
              .removeClass(className.active)
            ;
          },
          legacy: function() {
            $dimmer.removeClass(className.legacy);
          },
          dimmed: function() {
            $dimmable.removeClass(className.dimmed);
          },
          disabled: function() {
            $dimmer.removeClass(className.disabled);
          },
          variation: function(variation) {
            variation = variation || settings.variation;
            if(variation) {
              $dimmer.removeClass(variation);
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      module.preinitialize();

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.dimmer.settings = {

  name        : 'Dimmer',
  namespace   : 'dimmer',

  silent      : false,
  debug       : false,
  verbose     : false,
  performance : true,

  // whether should use flex layout
  useFlex     : true,

  // name to distinguish between multiple dimmers in context
  dimmerName  : false,

  // whether to add a variation type
  variation   : false,

  // whether to bind close events
  closable    : 'auto',

  // whether to use css animations
  useCSS      : true,

  // css animation to use
  transition  : 'fade',

  // event to bind to
  on          : false,

  // overriding opacity value
  opacity     : 'auto',

  // transition durations
  duration    : {
    show : 500,
    hide : 500
  },
// whether the dynamically created dimmer should have a loader
  displayLoader: false,
  loaderText  : false,
  loaderVariation : '',

  onChange    : function(){},
  onShow      : function(){},
  onHide      : function(){},

  error   : {
    method   : 'The method you called is not defined.'
  },

  className : {
    active     : 'active',
    animating  : 'animating',
    dimmable   : 'dimmable',
    dimmed     : 'dimmed',
    dimmer     : 'dimmer',
    disabled   : 'disabled',
    hide       : 'hide',
    legacy     : 'legacy',
    pageDimmer : 'page',
    show       : 'show',
    loader     : 'ui loader'
  },

  selector: {
    dimmer   : '> .ui.dimmer',
    content  : '.ui.dimmer > .content, .ui.dimmer > .content > .center'
  },

  template: {
    dimmer: function(settings) {
        var d = $('<div/>').addClass('ui dimmer'),l;
        if(settings.displayLoader) {
          l = $('<div/>')
              .addClass(settings.className.loader)
              .addClass(settings.loaderVariation);
          if(!!settings.loaderText){
            l.text(settings.loaderText);
            l.addClass('text');
          }
          d.append(l);
        }
        return d;
    }
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Dropdown
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.dropdown = function(parameters) {
  var
    $allModules    = $(this),
    $document      = $(document),

    moduleSelector = $allModules.selector || '',

    hasTouch       = ('ontouchstart' in document.documentElement),
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function(elementIndex) {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dropdown.settings, parameters)
          : $.extend({}, $.fn.dropdown.settings),

        className       = settings.className,
        message         = settings.message,
        fields          = settings.fields,
        keys            = settings.keys,
        metadata        = settings.metadata,
        namespace       = settings.namespace,
        regExp          = settings.regExp,
        selector        = settings.selector,
        error           = settings.error,
        templates       = settings.templates,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $text           = $module.find(selector.text),
        $search         = $module.find(selector.search),
        $sizer          = $module.find(selector.sizer),
        $input          = $module.find(selector.input),
        $icon           = $module.find(selector.icon),
        $clear          = $module.find(selector.clearIcon),

        $combo = ($module.prev().find(selector.text).length > 0)
          ? $module.prev().find(selector.text)
          : $module.prev(),

        $menu           = $module.children(selector.menu),
        $item           = $menu.find(selector.item),
        $divider        = settings.hideDividers ? $item.parent().children(selector.divider) : $(),

        activated       = false,
        itemActivated   = false,
        internalChange  = false,
        iconClicked     = false,
        element         = this,
        instance        = $module.data(moduleNamespace),

        initialLoad,
        pageLostFocus,
        willRefocus,
        elementNamespace,
        id,
        selectObserver,
        menuObserver,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing dropdown', settings);

          if( module.is.alreadySetup() ) {
            module.setup.reference();
          }
          else {
            if (settings.ignoreDiacritics && !String.prototype.normalize) {
              settings.ignoreDiacritics = false;
              module.error(error.noNormalize, element);
            }

            module.setup.layout();

            if(settings.values) {
              module.change.values(settings.values);
            }

            module.refreshData();

            module.save.defaults();
            module.restore.selected();

            module.create.id();
            module.bind.events();

            module.observeChanges();
            module.instantiate();
          }

        },

        instantiate: function() {
          module.verbose('Storing instance of dropdown', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous dropdown', $module);
          module.remove.tabbable();
          module.remove.active();
          $menu.transition('stop all');
          $menu.removeClass(className.visible).addClass(className.hidden);
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
          $menu
            .off(eventNamespace)
          ;
          $document
            .off(elementNamespace)
          ;
          module.disconnect.menuObserver();
          module.disconnect.selectObserver();
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            selectObserver = new MutationObserver(module.event.select.mutation);
            menuObserver   = new MutationObserver(module.event.menu.mutation);
            module.debug('Setting up mutation observer', selectObserver, menuObserver);
            module.observe.select();
            module.observe.menu();
          }
        },

        disconnect: {
          menuObserver: function() {
            if(menuObserver) {
              menuObserver.disconnect();
            }
          },
          selectObserver: function() {
            if(selectObserver) {
              selectObserver.disconnect();
            }
          }
        },
        observe: {
          select: function() {
            if(module.has.input() && selectObserver) {
              selectObserver.observe($module[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          menu: function() {
            if(module.has.menu() && menuObserver) {
              menuObserver.observe($menu[0], {
                childList : true,
                subtree   : true
              });
            }
          }
        },

        create: {
          id: function() {
            id = (Math.random().toString(16) + '000000000').substr(2, 8);
            elementNamespace = '.' + id;
            module.verbose('Creating unique id for element', id);
          },
          userChoice: function(values) {
            var
              $userChoices,
              $userChoice,
              isUserValue,
              html
            ;
            values = values || module.get.userValues();
            if(!values) {
              return false;
            }
            values = Array.isArray(values)
              ? values
              : [values]
            ;
            $.each(values, function(index, value) {
              if(module.get.item(value) === false) {
                html         = settings.templates.addition( module.add.variables(message.addResult, value) );
                $userChoice  = $('<div />')
                  .html(html)
                  .attr('data-' + metadata.value, value)
                  .attr('data-' + metadata.text, value)
                  .addClass(className.addition)
                  .addClass(className.item)
                ;
                if(settings.hideAdditions) {
                  $userChoice.addClass(className.hidden);
                }
                $userChoices = ($userChoices === undefined)
                  ? $userChoice
                  : $userChoices.add($userChoice)
                ;
                module.verbose('Creating user choices for value', value, $userChoice);
              }
            });
            return $userChoices;
          },
          userLabels: function(value) {
            var
              userValues = module.get.userValues()
            ;
            if(userValues) {
              module.debug('Adding user labels', userValues);
              $.each(userValues, function(index, value) {
                module.verbose('Adding custom user value');
                module.add.label(value, value);
              });
            }
          },
          menu: function() {
            $menu = $('<div />')
              .addClass(className.menu)
              .appendTo($module)
            ;
          },
          sizer: function() {
            $sizer = $('<span />')
              .addClass(className.sizer)
              .insertAfter($search)
            ;
          }
        },

        search: function(query) {
          query = (query !== undefined)
            ? query
            : module.get.query()
          ;
          module.verbose('Searching for query', query);
          if(module.has.minCharacters(query)) {
            module.filter(query);
          }
          else {
            module.hide();
          }
        },

        select: {
          firstUnfiltered: function() {
            module.verbose('Selecting first non-filtered element');
            module.remove.selectedItem();
            $item
              .not(selector.unselectable)
              .not(selector.addition + selector.hidden)
                .eq(0)
                .addClass(className.selected)
            ;
          },
          nextAvailable: function($selected) {
            $selected = $selected.eq(0);
            var
              $nextAvailable = $selected.nextAll(selector.item).not(selector.unselectable).eq(0),
              $prevAvailable = $selected.prevAll(selector.item).not(selector.unselectable).eq(0),
              hasNext        = ($nextAvailable.length > 0)
            ;
            if(hasNext) {
              module.verbose('Moving selection to', $nextAvailable);
              $nextAvailable.addClass(className.selected);
            }
            else {
              module.verbose('Moving selection to', $prevAvailable);
              $prevAvailable.addClass(className.selected);
            }
          }
        },

        setup: {
          api: function() {
            var
              apiSettings = {
                debug   : settings.debug,
                urlData : {
                  value : module.get.value(),
                  query : module.get.query()
                },
                on    : false
              }
            ;
            module.verbose('First request, initializing API');
            $module
              .api(apiSettings)
            ;
          },
          layout: function() {
            if( $module.is('select') ) {
              module.setup.select();
              module.setup.returnedObject();
            }
            if( !module.has.menu() ) {
              module.create.menu();
            }
            if ( module.is.selection() && module.is.clearable() && !module.has.clearItem() ) {
              module.verbose('Adding clear icon');
              $clear = $('<i />')
                .addClass('remove icon')
                .insertBefore($text)
              ;
            }
            if( module.is.search() && !module.has.search() ) {
              module.verbose('Adding search input');
              $search = $('<input />')
                .addClass(className.search)
                .prop('autocomplete', 'off')
                .insertBefore($text)
              ;
            }
            if( module.is.multiple() && module.is.searchSelection() && !module.has.sizer()) {
              module.create.sizer();
            }
            if(settings.allowTab) {
              module.set.tabbable();
            }
          },
          select: function() {
            var
              selectValues  = module.get.selectValues()
            ;
            module.debug('Dropdown initialized on a select', selectValues);
            if( $module.is('select') ) {
              $input = $module;
            }
            // see if select is placed correctly already
            if($input.parent(selector.dropdown).length > 0) {
              module.debug('UI dropdown already exists. Creating dropdown menu only');
              $module = $input.closest(selector.dropdown);
              if( !module.has.menu() ) {
                module.create.menu();
              }
              $menu = $module.children(selector.menu);
              module.setup.menu(selectValues);
            }
            else {
              module.debug('Creating entire dropdown from select');
              $module = $('<div />')
                .attr('class', $input.attr('class') )
                .addClass(className.selection)
                .addClass(className.dropdown)
                .html( templates.dropdown(selectValues,settings.preserveHTML, settings.className) )
                .insertBefore($input)
              ;
              if($input.hasClass(className.multiple) && $input.prop('multiple') === false) {
                module.error(error.missingMultiple);
                $input.prop('multiple', true);
              }
              if($input.is('[multiple]')) {
                module.set.multiple();
              }
              if ($input.prop('disabled')) {
                module.debug('Disabling dropdown');
                $module.addClass(className.disabled);
              }
              $input
                .removeAttr('class')
                .detach()
                .prependTo($module)
              ;
            }
            module.refresh();
          },
          menu: function(values) {
            $menu.html( templates.menu(values, fields,settings.preserveHTML,settings.className));
            $item    = $menu.find(selector.item);
            $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
          },
          reference: function() {
            module.debug('Dropdown behavior was called on select, replacing with closest dropdown');
            // replace module reference
            $module  = $module.parent(selector.dropdown);
            instance = $module.data(moduleNamespace);
            element  = $module.get(0);
            module.refresh();
            module.setup.returnedObject();
          },
          returnedObject: function() {
            var
              $firstModules = $allModules.slice(0, elementIndex),
              $lastModules  = $allModules.slice(elementIndex + 1)
            ;
            // adjust all modules to use correct reference
            $allModules = $firstModules.add($module).add($lastModules);
          }
        },

        refresh: function() {
          module.refreshSelectors();
          module.refreshData();
        },

        refreshItems: function() {
          $item    = $menu.find(selector.item);
          $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
        },

        refreshSelectors: function() {
          module.verbose('Refreshing selector cache');
          $text   = $module.find(selector.text);
          $search = $module.find(selector.search);
          $input  = $module.find(selector.input);
          $icon   = $module.find(selector.icon);
          $combo  = ($module.prev().find(selector.text).length > 0)
            ? $module.prev().find(selector.text)
            : $module.prev()
          ;
          $menu    = $module.children(selector.menu);
          $item    = $menu.find(selector.item);
          $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
        },

        refreshData: function() {
          module.verbose('Refreshing cached metadata');
          $item
            .removeData(metadata.text)
            .removeData(metadata.value)
          ;
        },

        clearData: function() {
          module.verbose('Clearing metadata');
          $item
            .removeData(metadata.text)
            .removeData(metadata.value)
          ;
          $module
            .removeData(metadata.defaultText)
            .removeData(metadata.defaultValue)
            .removeData(metadata.placeholderText)
          ;
        },

        toggle: function() {
          module.verbose('Toggling menu visibility');
          if( !module.is.active() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if(!module.can.show() && module.is.remote()) {
            module.debug('No API results retrieved, searching before show');
            module.queryRemote(module.get.query(), module.show);
          }
          if( module.can.show() && !module.is.active() ) {
            module.debug('Showing dropdown');
            if(module.has.message() && !(module.has.maxSelections() || module.has.allResultsFiltered()) ) {
              module.remove.message();
            }
            if(module.is.allFiltered()) {
              return true;
            }
            if(settings.onShow.call(element) !== false) {
              module.animate.show(function() {
                if( module.can.click() ) {
                  module.bind.intent();
                }
                if(module.has.search()) {
                  module.focusSearch();
                }
                module.set.visible();
                callback.call(element);
              });
            }
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.active() && !module.is.animatingOutward() ) {
            module.debug('Hiding dropdown');
            if(settings.onHide.call(element) !== false) {
              module.animate.hide(function() {
                module.remove.visible();
                // hidding search focus
                if ( module.is.focusedOnSearch() ) {
                  $search.blur();
                }
                callback.call(element);
              });
            }
          } else if( module.can.click() ) {
              module.unbind.intent();
          }
        },

        hideOthers: function() {
          module.verbose('Finding other dropdowns to hide');
          $allModules
            .not($module)
              .has(selector.menu + '.' + className.visible)
                .dropdown('hide')
          ;
        },

        hideMenu: function() {
          module.verbose('Hiding menu  instantaneously');
          module.remove.active();
          module.remove.visible();
          $menu.transition('hide');
        },

        hideSubMenus: function() {
          var
            $subMenus = $menu.children(selector.item).find(selector.menu)
          ;
          module.verbose('Hiding sub menus', $subMenus);
          $subMenus.transition('hide');
        },

        bind: {
          events: function() {
            if(hasTouch) {
              module.bind.touchEvents();
            }
            module.bind.keyboardEvents();
            module.bind.inputEvents();
            module.bind.mouseEvents();
          },
          touchEvents: function() {
            module.debug('Touch device detected binding additional touch events');
            if( module.is.searchSelection() ) {
              // do nothing special yet
            }
            else if( module.is.single() ) {
              $module
                .on('touchstart' + eventNamespace, module.event.test.toggle)
              ;
            }
            $menu
              .on('touchstart' + eventNamespace, selector.item, module.event.item.mouseenter)
            ;
          },
          keyboardEvents: function() {
            module.verbose('Binding keyboard events');
            $module
              .on('keydown' + eventNamespace, module.event.keydown)
            ;
            if( module.has.search() ) {
              $module
                .on(module.get.inputEvent() + eventNamespace, selector.search, module.event.input)
              ;
            }
            if( module.is.multiple() ) {
              $document
                .on('keydown' + elementNamespace, module.event.document.keydown)
              ;
            }
          },
          inputEvents: function() {
            module.verbose('Binding input change events');
            $module
              .on('change' + eventNamespace, selector.input, module.event.change)
            ;
          },
          mouseEvents: function() {
            module.verbose('Binding mouse events');
            if(module.is.multiple()) {
              $module
                .on('click'   + eventNamespace, selector.label,  module.event.label.click)
                .on('click'   + eventNamespace, selector.remove, module.event.remove.click)
              ;
            }
            if( module.is.searchSelection() ) {
              $module
                .on('mousedown' + eventNamespace, module.event.mousedown)
                .on('mouseup'   + eventNamespace, module.event.mouseup)
                .on('mousedown' + eventNamespace, selector.menu,   module.event.menu.mousedown)
                .on('mouseup'   + eventNamespace, selector.menu,   module.event.menu.mouseup)
                .on('click'     + eventNamespace, selector.icon,   module.event.icon.click)
                .on('click'     + eventNamespace, selector.clearIcon, module.event.clearIcon.click)
                .on('focus'     + eventNamespace, selector.search, module.event.search.focus)
                .on('click'     + eventNamespace, selector.search, module.event.search.focus)
                .on('blur'      + eventNamespace, selector.search, module.event.search.blur)
                .on('click'     + eventNamespace, selector.text,   module.event.text.focus)
              ;
              if(module.is.multiple()) {
                $module
                  .on('click' + eventNamespace, module.event.click)
                ;
              }
            }
            else {
              if(settings.on == 'click') {
                $module
                  .on('click' + eventNamespace, selector.icon, module.event.icon.click)
                  .on('click' + eventNamespace, module.event.test.toggle)
                ;
              }
              else if(settings.on == 'hover') {
                $module
                  .on('mouseenter' + eventNamespace, module.delay.show)
                  .on('mouseleave' + eventNamespace, module.delay.hide)
                ;
              }
              else {
                $module
                  .on(settings.on + eventNamespace, module.toggle)
                ;
              }
              $module
                .on('mousedown' + eventNamespace, module.event.mousedown)
                .on('mouseup'   + eventNamespace, module.event.mouseup)
                .on('focus'     + eventNamespace, module.event.focus)
                .on('click'     + eventNamespace, selector.clearIcon, module.event.clearIcon.click)
              ;
              if(module.has.menuSearch() ) {
                $module
                  .on('blur' + eventNamespace, selector.search, module.event.search.blur)
                ;
              }
              else {
                $module
                  .on('blur' + eventNamespace, module.event.blur)
                ;
              }
            }
            $menu
              .on('mouseenter' + eventNamespace, selector.item, module.event.item.mouseenter)
              .on('mouseleave' + eventNamespace, selector.item, module.event.item.mouseleave)
              .on('click'      + eventNamespace, selector.item, module.event.item.click)
            ;
          },
          intent: function() {
            module.verbose('Binding hide intent event to document');
            if(hasTouch) {
              $document
                .on('touchstart' + elementNamespace, module.event.test.touch)
                .on('touchmove'  + elementNamespace, module.event.test.touch)
              ;
            }
            $document
              .on('click' + elementNamespace, module.event.test.hide)
            ;
          }
        },

        unbind: {
          intent: function() {
            module.verbose('Removing hide intent event from document');
            if(hasTouch) {
              $document
                .off('touchstart' + elementNamespace)
                .off('touchmove' + elementNamespace)
              ;
            }
            $document
              .off('click' + elementNamespace)
            ;
          }
        },

        filter: function(query) {
          var
            searchTerm = (query !== undefined)
              ? query
              : module.get.query(),
            afterFiltered = function() {
              if(module.is.multiple()) {
                module.filterActive();
              }
              if(query || (!query && module.get.activeItem().length == 0)) {
                module.select.firstUnfiltered();
              }
              if( module.has.allResultsFiltered() ) {
                if( settings.onNoResults.call(element, searchTerm) ) {
                  if(settings.allowAdditions) {
                    if(settings.hideAdditions) {
                      module.verbose('User addition with no menu, setting empty style');
                      module.set.empty();
                      module.hideMenu();
                    }
                  }
                  else {
                    module.verbose('All items filtered, showing message', searchTerm);
                    module.add.message(message.noResults);
                  }
                }
                else {
                  module.verbose('All items filtered, hiding dropdown', searchTerm);
                  module.hideMenu();
                }
              }
              else {
                module.remove.empty();
                module.remove.message();
              }
              if(settings.allowAdditions) {
                module.add.userSuggestion(module.escape.htmlEntities(query));
              }
              if(module.is.searchSelection() && module.can.show() && module.is.focusedOnSearch() ) {
                module.show();
              }
            }
          ;
          if(settings.useLabels && module.has.maxSelections()) {
            return;
          }
          if(settings.apiSettings) {
            if( module.can.useAPI() ) {
              module.queryRemote(searchTerm, function() {
                if(settings.filterRemoteData) {
                  module.filterItems(searchTerm);
                }
                var preSelected = $input.val();
                if(!Array.isArray(preSelected)) {
                    preSelected = preSelected && preSelected!=="" ? preSelected.split(settings.delimiter) : [];
                }
                $.each(preSelected,function(index,value){
                  $item.filter('[data-value="'+value+'"]')
                      .addClass(className.filtered)
                  ;
                });
                afterFiltered();
              });
            }
            else {
              module.error(error.noAPI);
            }
          }
          else {
            module.filterItems(searchTerm);
            afterFiltered();
          }
        },

        queryRemote: function(query, callback) {
          var
            apiSettings = {
              errorDuration : false,
              cache         : 'local',
              throttle      : settings.throttle,
              urlData       : {
                query: query
              },
              onError: function() {
                module.add.message(message.serverError);
                callback();
              },
              onFailure: function() {
                module.add.message(message.serverError);
                callback();
              },
              onSuccess : function(response) {
                var
                  values          = response[fields.remoteValues]
                ;
                if (!Array.isArray(values)){
                    values = [];
                }
                module.remove.message();
                module.setup.menu({
                  values: values
                });

                if(values.length===0 && !settings.allowAdditions) {
                  module.add.message(message.noResults);
                }
                callback();
              }
            }
          ;
          if( !$module.api('get request') ) {
            module.setup.api();
          }
          apiSettings = $.extend(true, {}, apiSettings, settings.apiSettings);
          $module
            .api('setting', apiSettings)
            .api('query')
          ;
        },

        filterItems: function(query) {
          var
            searchTerm = module.remove.diacritics(query !== undefined
              ? query
              : module.get.query()
            ),
            results          =  null,
            escapedTerm      = module.escape.string(searchTerm),
            beginsWithRegExp = new RegExp('^' + escapedTerm, 'igm')
          ;
          // avoid loop if we're matching nothing
          if( module.has.query() ) {
            results = [];

            module.verbose('Searching for matching values', searchTerm);
            $item
              .each(function(){
                var
                  $choice = $(this),
                  text,
                  value
                ;
                if(settings.match === 'both' || settings.match === 'text') {
                  text = module.remove.diacritics(String(module.get.choiceText($choice, false)));
                  if(text.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === true && module.fuzzySearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  }
                }
                if(settings.match === 'both' || settings.match === 'value') {
                  value = module.remove.diacritics(String(module.get.choiceValue($choice, text)));
                  if(value.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, value)) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === true && module.fuzzySearch(searchTerm, value)) {
                    results.push(this);
                    return true;
                  }
                }
              })
            ;
          }
          module.debug('Showing only matched items', searchTerm);
          module.remove.filteredItem();
          if(results) {
            $item
              .not(results)
              .addClass(className.filtered)
            ;
          }

          if(!module.has.query()) {
            $divider
              .removeClass(className.hidden);
          } else if(settings.hideDividers === true) {
            $divider
              .addClass(className.hidden);
          } else if(settings.hideDividers === 'empty') {
            $divider
              .removeClass(className.hidden)
              .filter(function() {
                // First find the last divider in this divider group
                // Dividers which are direct siblings are considered a group
                var lastDivider = $(this).nextUntil(selector.item);

                return (lastDivider.length ? lastDivider : $(this))
                // Count all non-filtered items until the next divider (or end of the dropdown)
                  .nextUntil(selector.divider)
                  .filter(selector.item + ":not(." + className.filtered + ")")
                  // Hide divider if no items are found
                  .length === 0;
              })
              .addClass(className.hidden);
          }
        },

        fuzzySearch: function(query, term) {
          var
            termLength  = term.length,
            queryLength = query.length
          ;
          query = query.toLowerCase();
          term  = term.toLowerCase();
          if(queryLength > termLength) {
            return false;
          }
          if(queryLength === termLength) {
            return (query === term);
          }
          search: for (var characterIndex = 0, nextCharacterIndex = 0; characterIndex < queryLength; characterIndex++) {
            var
              queryCharacter = query.charCodeAt(characterIndex)
            ;
            while(nextCharacterIndex < termLength) {
              if(term.charCodeAt(nextCharacterIndex++) === queryCharacter) {
                continue search;
              }
            }
            return false;
          }
          return true;
        },
        exactSearch: function (query, term) {
          query = query.toLowerCase();
          term  = term.toLowerCase();
          return term.indexOf(query) > -1;

        },
        filterActive: function() {
          if(settings.useLabels) {
            $item.filter('.' + className.active)
              .addClass(className.filtered)
            ;
          }
        },

        focusSearch: function(skipHandler) {
          if( module.has.search() && !module.is.focusedOnSearch() ) {
            if(skipHandler) {
              $module.off('focus' + eventNamespace, selector.search);
              $search.focus();
              $module.on('focus'  + eventNamespace, selector.search, module.event.search.focus);
            }
            else {
              $search.focus();
            }
          }
        },

        blurSearch: function() {
          if( module.has.search() ) {
            $search.blur();
          }
        },

        forceSelection: function() {
          var
            $currentlySelected = $item.not(className.filtered).filter('.' + className.selected).eq(0),
            $activeItem        = $item.not(className.filtered).filter('.' + className.active).eq(0),
            $selectedItem      = ($currentlySelected.length > 0)
              ? $currentlySelected
              : $activeItem,
            hasSelected = ($selectedItem.length > 0)
          ;
          if(hasSelected && !module.is.multiple()) {
            module.debug('Forcing partial selection to selected item', $selectedItem);
            module.event.item.click.call($selectedItem, {}, true);
          }
          else {
            if(settings.allowAdditions) {
              module.set.selected(module.get.query());
              module.remove.searchTerm();
            }
            else {
              module.remove.searchTerm();
            }
          }
        },

        change: {
          values: function(values) {
            if(!settings.allowAdditions) {
              module.clear();
            }
            module.debug('Creating dropdown with specified values', values);
            module.setup.menu({values: values});
            $.each(values, function(index, item) {
              if(item.selected == true) {
                module.debug('Setting initial selection to', item[fields.value]);
                module.set.selected(item[fields.value]);
                if(!module.is.multiple()) {
                  return false;
                }
              }
            });
          }
        },

        event: {
          change: function() {
            if(!internalChange) {
              module.debug('Input changed, updating selection');
              module.set.selected();
            }
          },
          focus: function() {
            if(settings.showOnFocus && !activated && module.is.hidden() && !pageLostFocus) {
              module.show();
            }
          },
          blur: function(event) {
            pageLostFocus = (document.activeElement === this);
            if(!activated && !pageLostFocus) {
              module.remove.activeLabel();
              module.hide();
            }
          },
          mousedown: function() {
            if(module.is.searchSelection()) {
              // prevent menu hiding on immediate re-focus
              willRefocus = true;
            }
            else {
              // prevents focus callback from occurring on mousedown
              activated = true;
            }
          },
          mouseup: function() {
            if(module.is.searchSelection()) {
              // prevent menu hiding on immediate re-focus
              willRefocus = false;
            }
            else {
              activated = false;
            }
          },
          click: function(event) {
            var
              $target = $(event.target)
            ;
            // focus search
            if($target.is($module)) {
              if(!module.is.focusedOnSearch()) {
                module.focusSearch();
              }
              else {
                module.show();
              }
            }
          },
          search: {
            focus: function(event) {
              activated = true;
              if(module.is.multiple()) {
                module.remove.activeLabel();
              }
              if(settings.showOnFocus || (event.type !== 'focus' && event.type !== 'focusin')) {
                module.search();
              }
            },
            blur: function(event) {
              pageLostFocus = (document.activeElement === this);
              if(module.is.searchSelection() && !willRefocus) {
                if(!itemActivated && !pageLostFocus) {
                  if(settings.forceSelection) {
                    module.forceSelection();
                  }
                  module.hide();
                }
              }
              willRefocus = false;
            }
          },
          clearIcon: {
            click: function(event) {
              module.clear();
              if(module.is.searchSelection()) {
                module.remove.searchTerm();
              }
              module.hide();
              event.stopPropagation();
            }
          },
          icon: {
            click: function(event) {
              iconClicked=true;
              if(module.has.search()) {
                if(!module.is.active()) {
                    if(settings.showOnFocus){
                      module.focusSearch();
                    } else {
                      module.toggle();
                    }
                } else {
                  module.blurSearch();
                }
              } else {
                module.toggle();
              }
            }
          },
          text: {
            focus: function(event) {
              activated = true;
              module.focusSearch();
            }
          },
          input: function(event) {
            if(module.is.multiple() || module.is.searchSelection()) {
              module.set.filtered();
            }
            clearTimeout(module.timer);
            module.timer = setTimeout(module.search, settings.delay.search);
          },
          label: {
            click: function(event) {
              var
                $label        = $(this),
                $labels       = $module.find(selector.label),
                $activeLabels = $labels.filter('.' + className.active),
                $nextActive   = $label.nextAll('.' + className.active),
                $prevActive   = $label.prevAll('.' + className.active),
                $range = ($nextActive.length > 0)
                  ? $label.nextUntil($nextActive).add($activeLabels).add($label)
                  : $label.prevUntil($prevActive).add($activeLabels).add($label)
              ;
              if(event.shiftKey) {
                $activeLabels.removeClass(className.active);
                $range.addClass(className.active);
              }
              else if(event.ctrlKey) {
                $label.toggleClass(className.active);
              }
              else {
                $activeLabels.removeClass(className.active);
                $label.addClass(className.active);
              }
              settings.onLabelSelect.apply(this, $labels.filter('.' + className.active));
            }
          },
          remove: {
            click: function() {
              var
                $label = $(this).parent()
              ;
              if( $label.hasClass(className.active) ) {
                // remove all selected labels
                module.remove.activeLabels();
              }
              else {
                // remove this label only
                module.remove.activeLabels( $label );
              }
            }
          },
          test: {
            toggle: function(event) {
              var
                toggleBehavior = (module.is.multiple())
                  ? module.show
                  : module.toggle
              ;
              if(module.is.bubbledLabelClick(event) || module.is.bubbledIconClick(event)) {
                return;
              }
              if( module.determine.eventOnElement(event, toggleBehavior) ) {
                event.preventDefault();
              }
            },
            touch: function(event) {
              module.determine.eventOnElement(event, function() {
                if(event.type == 'touchstart') {
                  module.timer = setTimeout(function() {
                    module.hide();
                  }, settings.delay.touch);
                }
                else if(event.type == 'touchmove') {
                  clearTimeout(module.timer);
                }
              });
              event.stopPropagation();
            },
            hide: function(event) {
              if(module.determine.eventInModule(event, module.hide)){
                  event.preventDefault();
              }
            }
          },
          select: {
            mutation: function(mutations) {
              module.debug('<select> modified, recreating menu');
              if(module.is.selectMutation(mutations)) {
                module.disconnect.selectObserver();
                module.refresh();
                module.setup.select();
                module.set.selected();
                module.observe.select();
              }
            }
          },
          menu: {
            mutation: function(mutations) {
              var
                mutation   = mutations[0],
                $addedNode = mutation.addedNodes
                  ? $(mutation.addedNodes[0])
                  : $(false),
                $removedNode = mutation.removedNodes
                  ? $(mutation.removedNodes[0])
                  : $(false),
                $changedNodes  = $addedNode.add($removedNode),
                isUserAddition = $changedNodes.is(selector.addition) || $changedNodes.closest(selector.addition).length > 0,
                isMessage      = $changedNodes.is(selector.message)  || $changedNodes.closest(selector.message).length > 0
              ;
              if(isUserAddition || isMessage) {
                module.debug('Updating item selector cache');
                module.refreshItems();
              }
              else {
                module.debug('Menu modified, updating selector cache');
                module.refresh();
              }
            },
            mousedown: function() {
              itemActivated = true;
            },
            mouseup: function() {
              itemActivated = false;
            }
          },
          item: {
            mouseenter: function(event) {
              var
                $target        = $(event.target),
                $item          = $(this),
                $subMenu       = $item.children(selector.menu),
                $otherMenus    = $item.siblings(selector.item).children(selector.menu),
                hasSubMenu     = ($subMenu.length > 0),
                isBubbledEvent = ($subMenu.find($target).length > 0)
              ;
              if( !isBubbledEvent && hasSubMenu ) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Showing sub-menu', $subMenu);
                  $.each($otherMenus, function() {
                    module.animate.hide(false, $(this));
                  });
                  module.animate.show(false, $subMenu);
                }, settings.delay.show);
                event.preventDefault();
              }
            },
            mouseleave: function(event) {
              var
                $subMenu = $(this).children(selector.menu)
              ;
              if($subMenu.length > 0) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Hiding sub-menu', $subMenu);
                  module.animate.hide(false, $subMenu);
                }, settings.delay.hide);
              }
            },
            click: function (event, skipRefocus) {
              var
                $choice        = $(this),
                $target        = (event)
                  ? $(event.target)
                  : $(''),
                $subMenu       = $choice.find(selector.menu),
                text           = module.get.choiceText($choice),
                value          = module.get.choiceValue($choice, text),
                hasSubMenu     = ($subMenu.length > 0),
                isBubbledEvent = ($subMenu.find($target).length > 0)
              ;
              // prevents IE11 bug where menu receives focus even though `tabindex=-1`
              if (!module.has.search() || !document.activeElement.isEqualNode($search[0])) {
                $(document.activeElement).blur();
              }
              if(!isBubbledEvent && (!hasSubMenu || settings.allowCategorySelection)) {
                if(module.is.searchSelection()) {
                  if(settings.allowAdditions) {
                    module.remove.userAddition();
                  }
                  module.remove.searchTerm();
                  if(!module.is.focusedOnSearch() && !(skipRefocus == true)) {
                    module.focusSearch(true);
                  }
                }
                if(!settings.useLabels) {
                  module.remove.filteredItem();
                  module.set.scrollPosition($choice);
                }
                module.determine.selectAction.call(this, text, value);
              }
            }
          },

          document: {
            // label selection should occur even when element has no focus
            keydown: function(event) {
              var
                pressedKey    = event.which,
                isShortcutKey = module.is.inObject(pressedKey, keys)
              ;
              if(isShortcutKey) {
                var
                  $label            = $module.find(selector.label),
                  $activeLabel      = $label.filter('.' + className.active),
                  activeValue       = $activeLabel.data(metadata.value),
                  labelIndex        = $label.index($activeLabel),
                  labelCount        = $label.length,
                  hasActiveLabel    = ($activeLabel.length > 0),
                  hasMultipleActive = ($activeLabel.length > 1),
                  isFirstLabel      = (labelIndex === 0),
                  isLastLabel       = (labelIndex + 1 == labelCount),
                  isSearch          = module.is.searchSelection(),
                  isFocusedOnSearch = module.is.focusedOnSearch(),
                  isFocused         = module.is.focused(),
                  caretAtStart      = (isFocusedOnSearch && module.get.caretPosition(false) === 0),
                  isSelectedSearch  = (caretAtStart && module.get.caretPosition(true) !== 0),
                  $nextLabel
                ;
                if(isSearch && !hasActiveLabel && !isFocusedOnSearch) {
                  return;
                }

                if(pressedKey == keys.leftArrow) {
                  // activate previous label
                  if((isFocused || caretAtStart) && !hasActiveLabel) {
                    module.verbose('Selecting previous label');
                    $label.last().addClass(className.active);
                  }
                  else if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting previous label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding previous label to selection');
                    }
                    if(isFirstLabel && !hasMultipleActive) {
                      $activeLabel.addClass(className.active);
                    }
                    else {
                      $activeLabel.prev(selector.siblingLabel)
                        .addClass(className.active)
                        .end()
                      ;
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.rightArrow) {
                  // activate first label
                  if(isFocused && !hasActiveLabel) {
                    $label.first().addClass(className.active);
                  }
                  // activate next label
                  if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting next label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding next label to selection');
                    }
                    if(isLastLabel) {
                      if(isSearch) {
                        if(!isFocusedOnSearch) {
                          module.focusSearch();
                        }
                        else {
                          $label.removeClass(className.active);
                        }
                      }
                      else if(hasMultipleActive) {
                        $activeLabel.next(selector.siblingLabel).addClass(className.active);
                      }
                      else {
                        $activeLabel.addClass(className.active);
                      }
                    }
                    else {
                      $activeLabel.next(selector.siblingLabel).addClass(className.active);
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.deleteKey || pressedKey == keys.backspace) {
                  if(hasActiveLabel) {
                    module.verbose('Removing active labels');
                    if(isLastLabel) {
                      if(isSearch && !isFocusedOnSearch) {
                        module.focusSearch();
                      }
                    }
                    $activeLabel.last().next(selector.siblingLabel).addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                    event.preventDefault();
                  }
                  else if(caretAtStart && !isSelectedSearch && !hasActiveLabel && pressedKey == keys.backspace) {
                    module.verbose('Removing last label on input backspace');
                    $activeLabel = $label.last().addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                  }
                }
                else {
                  $activeLabel.removeClass(className.active);
                }
              }
            }
          },

          keydown: function(event) {
            var
              pressedKey    = event.which,
              isShortcutKey = module.is.inObject(pressedKey, keys)
            ;
            if(isShortcutKey) {
              var
                $currentlySelected = $item.not(selector.unselectable).filter('.' + className.selected).eq(0),
                $activeItem        = $menu.children('.' + className.active).eq(0),
                $selectedItem      = ($currentlySelected.length > 0)
                  ? $currentlySelected
                  : $activeItem,
                $visibleItems = ($selectedItem.length > 0)
                  ? $selectedItem.siblings(':not(.' + className.filtered +')').addBack()
                  : $menu.children(':not(.' + className.filtered +')'),
                $subMenu              = $selectedItem.children(selector.menu),
                $parentMenu           = $selectedItem.closest(selector.menu),
                inVisibleMenu         = ($parentMenu.hasClass(className.visible) || $parentMenu.hasClass(className.animating) || $parentMenu.parent(selector.menu).length > 0),
                hasSubMenu            = ($subMenu.length> 0),
                hasSelectedItem       = ($selectedItem.length > 0),
                selectedIsSelectable  = ($selectedItem.not(selector.unselectable).length > 0),
                delimiterPressed      = (pressedKey == keys.delimiter && settings.allowAdditions && module.is.multiple()),
                isAdditionWithoutMenu = (settings.allowAdditions && settings.hideAdditions && (pressedKey == keys.enter || delimiterPressed) && selectedIsSelectable),
                $nextItem,
                isSubMenuItem,
                newIndex
              ;
              // allow selection with menu closed
              if(isAdditionWithoutMenu) {
                module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                module.event.item.click.call($selectedItem, event);
                if(module.is.searchSelection()) {
                  module.remove.searchTerm();
                }
                if(module.is.multiple()){
                    event.preventDefault();
                }
              }

              // visible menu keyboard shortcuts
              if( module.is.visible() ) {

                // enter (select or open sub-menu)
                if(pressedKey == keys.enter || delimiterPressed) {
                  if(pressedKey == keys.enter && hasSelectedItem && hasSubMenu && !settings.allowCategorySelection) {
                    module.verbose('Pressed enter on unselectable category, opening sub menu');
                    pressedKey = keys.rightArrow;
                  }
                  else if(selectedIsSelectable) {
                    module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                    module.event.item.click.call($selectedItem, event);
                    if(module.is.searchSelection()) {
                      module.remove.searchTerm();
                      if(module.is.multiple()) {
                          $search.focus();
                      }
                    }
                  }
                  event.preventDefault();
                }

                // sub-menu actions
                if(hasSelectedItem) {

                  if(pressedKey == keys.leftArrow) {

                    isSubMenuItem = ($parentMenu[0] !== $menu[0]);

                    if(isSubMenuItem) {
                      module.verbose('Left key pressed, closing sub-menu');
                      module.animate.hide(false, $parentMenu);
                      $selectedItem
                        .removeClass(className.selected)
                      ;
                      $parentMenu
                        .closest(selector.item)
                          .addClass(className.selected)
                      ;
                      event.preventDefault();
                    }
                  }

                  // right arrow (show sub-menu)
                  if(pressedKey == keys.rightArrow) {
                    if(hasSubMenu) {
                      module.verbose('Right key pressed, opening sub-menu');
                      module.animate.show(false, $subMenu);
                      $selectedItem
                        .removeClass(className.selected)
                      ;
                      $subMenu
                        .find(selector.item).eq(0)
                          .addClass(className.selected)
                      ;
                      event.preventDefault();
                    }
                  }
                }

                // up arrow (traverse menu up)
                if(pressedKey == keys.upArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $selectedItem.prevAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($visibleItems.index( $nextItem ) < 0) {
                    module.verbose('Up key pressed but reached top of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Up key pressed, changing active item');
                    $selectedItem
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                    if(settings.selectOnKeydown && module.is.single()) {
                      module.set.selectedItem($nextItem);
                    }
                  }
                  event.preventDefault();
                }

                // down arrow (traverse menu down)
                if(pressedKey == keys.downArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $nextItem = $selectedItem.nextAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($nextItem.length === 0) {
                    module.verbose('Down key pressed but reached bottom of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Down key pressed, changing active item');
                    $item
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                    if(settings.selectOnKeydown && module.is.single()) {
                      module.set.selectedItem($nextItem);
                    }
                  }
                  event.preventDefault();
                }

                // page down (show next page)
                if(pressedKey == keys.pageUp) {
                  module.scrollPage('up');
                  event.preventDefault();
                }
                if(pressedKey == keys.pageDown) {
                  module.scrollPage('down');
                  event.preventDefault();
                }

                // escape (close menu)
                if(pressedKey == keys.escape) {
                  module.verbose('Escape key pressed, closing dropdown');
                  module.hide();
                }

              }
              else {
                // delimiter key
                if(delimiterPressed) {
                  event.preventDefault();
                }
                // down arrow (open menu)
                if(pressedKey == keys.downArrow && !module.is.visible()) {
                  module.verbose('Down key pressed, showing dropdown');
                  module.show();
                  event.preventDefault();
                }
              }
            }
            else {
              if( !module.has.search() ) {
                module.set.selectedLetter( String.fromCharCode(pressedKey) );
              }
            }
          }
        },

        trigger: {
          change: function() {
            var
              events       = document.createEvent('HTMLEvents'),
              inputElement = $input[0]
            ;
            if(inputElement) {
              module.verbose('Triggering native change event');
              events.initEvent('change', true, false);
              inputElement.dispatchEvent(events);
            }
          }
        },

        determine: {
          selectAction: function(text, value) {
            module.verbose('Determining action', settings.action);
            if( $.isFunction( module.action[settings.action] ) ) {
              module.verbose('Triggering preset action', settings.action, text, value);
              module.action[ settings.action ].call(element, text, value, this);
            }
            else if( $.isFunction(settings.action) ) {
              module.verbose('Triggering user action', settings.action, text, value);
              settings.action.call(element, text, value, this);
            }
            else {
              module.error(error.action, settings.action);
            }
          },
          eventInModule: function(event, callback) {
            var
              $target    = $(event.target),
              inDocument = ($target.closest(document.documentElement).length > 0),
              inModule   = ($target.closest($module).length > 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(inDocument && !inModule) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown, canceling callback');
              return false;
            }
          },
          eventOnElement: function(event, callback) {
            var
              $target      = $(event.target),
              $label       = $target.closest(selector.siblingLabel),
              inVisibleDOM = document.body.contains(event.target),
              notOnLabel   = ($module.find($label).length === 0 || !(module.is.multiple() && settings.useLabels)),
              notInMenu    = ($target.closest($menu).length === 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(inVisibleDOM && notOnLabel && notInMenu) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown menu, canceling callback');
              return false;
            }
          }
        },

        action: {

          nothing: function() {},

          activate: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            if( module.can.activate( $(element) ) ) {
              module.set.selected(value, $(element));
              if(!module.is.multiple()) {
                module.hideAndClear();
              }
            }
          },

          select: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            if( module.can.activate( $(element) ) ) {
              module.set.value(value, text, $(element));
              if(!module.is.multiple()) {
                module.hideAndClear();
              }
            }
          },

          combo: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            module.set.selected(value, $(element));
            module.hideAndClear();
          },

          hide: function(text, value, element) {
            module.set.value(value, text, $(element));
            module.hideAndClear();
          }

        },

        get: {
          id: function() {
            return id;
          },
          defaultText: function() {
            return $module.data(metadata.defaultText);
          },
          defaultValue: function() {
            return $module.data(metadata.defaultValue);
          },
          placeholderText: function() {
            if(settings.placeholder != 'auto' && typeof settings.placeholder == 'string') {
              return settings.placeholder;
            }
            return $module.data(metadata.placeholderText) || '';
          },
          text: function() {
            return $text.text();
          },
          query: function() {
            return $.trim($search.val());
          },
          searchWidth: function(value) {
            value = (value !== undefined)
              ? value
              : $search.val()
            ;
            $sizer.text(value);
            // prevent rounding issues
            return Math.ceil( $sizer.width() + 1);
          },
          selectionCount: function() {
            var
              values = module.get.values(),
              count
            ;
            count = ( module.is.multiple() )
              ? Array.isArray(values)
                ? values.length
                : 0
              : (module.get.value() !== '')
                ? 1
                : 0
            ;
            return count;
          },
          transition: function($subMenu) {
            return (settings.transition == 'auto')
              ? module.is.upward($subMenu)
                ? 'slide up'
                : 'slide down'
              : settings.transition
            ;
          },
          userValues: function() {
            var
              values = module.get.values()
            ;
            if(!values) {
              return false;
            }
            values = Array.isArray(values)
              ? values
              : [values]
            ;
            return $.grep(values, function(value) {
              return (module.get.item(value) === false);
            });
          },
          uniqueArray: function(array) {
            return $.grep(array, function (value, index) {
                return $.inArray(value, array) === index;
            });
          },
          caretPosition: function(returnEndPos) {
            var
              input = $search.get(0),
              range,
              rangeLength
            ;
            if(returnEndPos && 'selectionEnd' in input){
              return input.selectionEnd;
            }
            else if(!returnEndPos && 'selectionStart' in input) {
              return input.selectionStart;
            }
            if (document.selection) {
              input.focus();
              range       = document.selection.createRange();
              rangeLength = range.text.length;
              if(returnEndPos) {
                return rangeLength;
              }
              range.moveStart('character', -input.value.length);
              return range.text.length - rangeLength;
            }
          },
          value: function() {
            var
              value = ($input.length > 0)
                ? $input.val()
                : $module.data(metadata.value),
              isEmptyMultiselect = (Array.isArray(value) && value.length === 1 && value[0] === '')
            ;
            // prevents placeholder element from being selected when multiple
            return (value === undefined || isEmptyMultiselect)
              ? ''
              : value
            ;
          },
          values: function() {
            var
              value = module.get.value()
            ;
            if(value === '') {
              return '';
            }
            return ( !module.has.selectInput() && module.is.multiple() )
              ? (typeof value == 'string') // delimited string
                ? value.split(settings.delimiter)
                : ''
              : value
            ;
          },
          remoteValues: function() {
            var
              values = module.get.values(),
              remoteValues = false
            ;
            if(values) {
              if(typeof values == 'string') {
                values = [values];
              }
              $.each(values, function(index, value) {
                var
                  name = module.read.remoteData(value)
                ;
                module.verbose('Restoring value from session data', name, value);
                if(name) {
                  if(!remoteValues) {
                    remoteValues = {};
                  }
                  remoteValues[value] = name;
                }
              });
            }
            return remoteValues;
          },
          choiceText: function($choice, preserveHTML) {
            preserveHTML = (preserveHTML !== undefined)
              ? preserveHTML
              : settings.preserveHTML
            ;
            if($choice) {
              if($choice.find(selector.menu).length > 0) {
                module.verbose('Retrieving text of element with sub-menu');
                $choice = $choice.clone();
                $choice.find(selector.menu).remove();
                $choice.find(selector.menuIcon).remove();
              }
              return ($choice.data(metadata.text) !== undefined)
                ? $choice.data(metadata.text)
                : (preserveHTML)
                  ? $.trim($choice.html())
                  : $.trim($choice.text())
              ;
            }
          },
          choiceValue: function($choice, choiceText) {
            choiceText = choiceText || module.get.choiceText($choice);
            if(!$choice) {
              return false;
            }
            return ($choice.data(metadata.value) !== undefined)
              ? String( $choice.data(metadata.value) )
              : (typeof choiceText === 'string')
                ? $.trim(choiceText.toLowerCase())
                : String(choiceText)
            ;
          },
          inputEvent: function() {
            var
              input = $search[0]
            ;
            if(input) {
              return (input.oninput !== undefined)
                ? 'input'
                : (input.onpropertychange !== undefined)
                  ? 'propertychange'
                  : 'keyup'
              ;
            }
            return false;
          },
          selectValues: function() {
            var
              select = {}
            ;
            select.values = [];
            $module
              .find('option')
                .each(function() {
                  var
                    $option  = $(this),
                    name     = $option.html(),
                    disabled = $option.attr('disabled'),
                    value    = ( $option.attr('value') !== undefined )
                      ? $option.attr('value')
                      : name
                  ;
                  if(settings.placeholder === 'auto' && value === '') {
                    select.placeholder = name;
                  }
                  else {
                    select.values.push({
                      name     : name,
                      value    : value,
                      disabled : disabled
                    });
                  }
                })
            ;
            if(settings.placeholder && settings.placeholder !== 'auto') {
              module.debug('Setting placeholder value to', settings.placeholder);
              select.placeholder = settings.placeholder;
            }
            if(settings.sortSelect) {
              if(settings.sortSelect === true) {
                select.values.sort(function(a, b) {
                  return a.name.localeCompare(b.name);
                });
              } else if(settings.sortSelect === 'natural') {
                select.values.sort(function(a, b) {
                  return (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                });
              } else if($.isFunction(settings.sortSelect)) {
                select.values.sort(settings.sortSelect);
              }
              module.debug('Retrieved and sorted values from select', select);
            }
            else {
              module.debug('Retrieved values from select', select);
            }
            return select;
          },
          activeItem: function() {
            return $item.filter('.'  + className.active);
          },
          selectedItem: function() {
            var
              $selectedItem = $item.not(selector.unselectable).filter('.'  + className.selected)
            ;
            return ($selectedItem.length > 0)
              ? $selectedItem
              : $item.eq(0)
            ;
          },
          itemWithAdditions: function(value) {
            var
              $items       = module.get.item(value),
              $userItems   = module.create.userChoice(value),
              hasUserItems = ($userItems && $userItems.length > 0)
            ;
            if(hasUserItems) {
              $items = ($items.length > 0)
                ? $items.add($userItems)
                : $userItems
              ;
            }
            return $items;
          },
          item: function(value, strict) {
            var
              $selectedItem = false,
              shouldSearch,
              isMultiple
            ;
            value = (value !== undefined)
              ? value
              : ( module.get.values() !== undefined)
                ? module.get.values()
                : module.get.text()
            ;
            shouldSearch = (isMultiple)
              ? (value.length > 0)
              : (value !== undefined && value !== null)
            ;
            isMultiple = (module.is.multiple() && Array.isArray(value));
            strict     = (value === '' || value === false  || value === true)
              ? true
              : strict || false
            ;
            if(shouldSearch) {
              $item
                .each(function() {
                  var
                    $choice       = $(this),
                    optionText    = module.get.choiceText($choice),
                    optionValue   = module.get.choiceValue($choice, optionText)
                  ;
                  // safe early exit
                  if(optionValue === null || optionValue === undefined) {
                    return;
                  }
                  if(isMultiple) {
                    if($.inArray( String(optionValue), value) !== -1) {
                      $selectedItem = ($selectedItem)
                        ? $selectedItem.add($choice)
                        : $choice
                      ;
                    }
                  }
                  else if(strict) {
                    module.verbose('Ambiguous dropdown value using strict type check', $choice, value);
                    if( optionValue === value) {
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                  else {
                    if( String(optionValue) == String(value)) {
                      module.verbose('Found select item by value', optionValue, value);
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                })
              ;
            }
            return $selectedItem;
          }
        },

        check: {
          maxSelections: function(selectionCount) {
            if(settings.maxSelections) {
              selectionCount = (selectionCount !== undefined)
                ? selectionCount
                : module.get.selectionCount()
              ;
              if(selectionCount >= settings.maxSelections) {
                module.debug('Maximum selection count reached');
                if(settings.useLabels) {
                  $item.addClass(className.filtered);
                  module.add.message(message.maxSelections);
                }
                return true;
              }
              else {
                module.verbose('No longer at maximum selection count');
                module.remove.message();
                module.remove.filteredItem();
                if(module.is.searchSelection()) {
                  module.filterItems();
                }
                return false;
              }
            }
            return true;
          }
        },

        restore: {
          defaults: function() {
            module.clear();
            module.restore.defaultText();
            module.restore.defaultValue();
          },
          defaultText: function() {
            var
              defaultText     = module.get.defaultText(),
              placeholderText = module.get.placeholderText
            ;
            if(defaultText === placeholderText) {
              module.debug('Restoring default placeholder text', defaultText);
              module.set.placeholderText(defaultText);
            }
            else {
              module.debug('Restoring default text', defaultText);
              module.set.text(defaultText);
            }
          },
          placeholderText: function() {
            module.set.placeholderText();
          },
          defaultValue: function() {
            var
              defaultValue = module.get.defaultValue()
            ;
            if(defaultValue !== undefined) {
              module.debug('Restoring default value', defaultValue);
              if(defaultValue !== '') {
                module.set.value(defaultValue);
                module.set.selected();
              }
              else {
                module.remove.activeItem();
                module.remove.selectedItem();
              }
            }
          },
          labels: function() {
            if(settings.allowAdditions) {
              if(!settings.useLabels) {
                module.error(error.labels);
                settings.useLabels = true;
              }
              module.debug('Restoring selected values');
              module.create.userLabels();
            }
            module.check.maxSelections();
          },
          selected: function() {
            module.restore.values();
            if(module.is.multiple()) {
              module.debug('Restoring previously selected values and labels');
              module.restore.labels();
            }
            else {
              module.debug('Restoring previously selected values');
            }
          },
          values: function() {
            // prevents callbacks from occurring on initial load
            module.set.initialLoad();
            if(settings.apiSettings && settings.saveRemoteData && module.get.remoteValues()) {
              module.restore.remoteValues();
            }
            else {
              module.set.selected();
            }
            if(module.get.item()) {
              $input.removeClass(className.noselection);
            } else {
              $input.addClass(className.noselection);
            }
            module.remove.initialLoad();
          },
          remoteValues: function() {
            var
              values = module.get.remoteValues()
            ;
            module.debug('Recreating selected from session data', values);
            if(values) {
              if( module.is.single() ) {
                $.each(values, function(value, name) {
                  module.set.text(name);
                });
              }
              else {
                $.each(values, function(value, name) {
                  module.add.label(value, name);
                });
              }
            }
          }
        },

        read: {
          remoteData: function(value) {
            var
              name
            ;
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            name = sessionStorage.getItem(value);
            return (name !== undefined)
              ? name
              : false
            ;
          }
        },

        save: {
          defaults: function() {
            module.save.defaultText();
            module.save.placeholderText();
            module.save.defaultValue();
          },
          defaultValue: function() {
            var
              value = module.get.value()
            ;
            module.verbose('Saving default value as', value);
            $module.data(metadata.defaultValue, value);
          },
          defaultText: function() {
            var
              text = module.get.text()
            ;
            module.verbose('Saving default text as', text);
            $module.data(metadata.defaultText, text);
          },
          placeholderText: function() {
            var
              text
            ;
            if(settings.placeholder !== false && $text.hasClass(className.placeholder)) {
              text = module.get.text();
              module.verbose('Saving placeholder text as', text);
              $module.data(metadata.placeholderText, text);
            }
          },
          remoteData: function(name, value) {
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            module.verbose('Saving remote data to session storage', value, name);
            sessionStorage.setItem(value, name);
          }
        },

        clear: function() {
          if(module.is.multiple() && settings.useLabels) {
            module.remove.labels();
          }
          else {
            module.remove.activeItem();
            module.remove.selectedItem();
            module.remove.filteredItem();
          }
          module.set.placeholderText();
          module.clearValue();
        },

        clearValue: function() {
          module.set.value('');
        },

        scrollPage: function(direction, $selectedItem) {
          var
            $currentItem  = $selectedItem || module.get.selectedItem(),
            $menu         = $currentItem.closest(selector.menu),
            menuHeight    = $menu.outerHeight(),
            currentScroll = $menu.scrollTop(),
            itemHeight    = $item.eq(0).outerHeight(),
            itemsPerPage  = Math.floor(menuHeight / itemHeight),
            maxScroll     = $menu.prop('scrollHeight'),
            newScroll     = (direction == 'up')
              ? currentScroll - (itemHeight * itemsPerPage)
              : currentScroll + (itemHeight * itemsPerPage),
            $selectableItem = $item.not(selector.unselectable),
            isWithinRange,
            $nextSelectedItem,
            elementIndex
          ;
          elementIndex      = (direction == 'up')
            ? $selectableItem.index($currentItem) - itemsPerPage
            : $selectableItem.index($currentItem) + itemsPerPage
          ;
          isWithinRange = (direction == 'up')
            ? (elementIndex >= 0)
            : (elementIndex < $selectableItem.length)
          ;
          $nextSelectedItem = (isWithinRange)
            ? $selectableItem.eq(elementIndex)
            : (direction == 'up')
              ? $selectableItem.first()
              : $selectableItem.last()
          ;
          if($nextSelectedItem.length > 0) {
            module.debug('Scrolling page', direction, $nextSelectedItem);
            $currentItem
              .removeClass(className.selected)
            ;
            $nextSelectedItem
              .addClass(className.selected)
            ;
            if(settings.selectOnKeydown && module.is.single()) {
              module.set.selectedItem($nextSelectedItem);
            }
            $menu
              .scrollTop(newScroll)
            ;
          }
        },

        set: {
          filtered: function() {
            var
              isMultiple       = module.is.multiple(),
              isSearch         = module.is.searchSelection(),
              isSearchMultiple = (isMultiple && isSearch),
              searchValue      = (isSearch)
                ? module.get.query()
                : '',
              hasSearchValue   = (typeof searchValue === 'string' && searchValue.length > 0),
              searchWidth      = module.get.searchWidth(),
              valueIsSet       = searchValue !== ''
            ;
            if(isMultiple && hasSearchValue) {
              module.verbose('Adjusting input width', searchWidth, settings.glyphWidth);
              $search.css('width', searchWidth);
            }
            if(hasSearchValue || (isSearchMultiple && valueIsSet)) {
              module.verbose('Hiding placeholder text');
              $text.addClass(className.filtered);
            }
            else if(!isMultiple || (isSearchMultiple && !valueIsSet)) {
              module.verbose('Showing placeholder text');
              $text.removeClass(className.filtered);
            }
          },
          empty: function() {
            $module.addClass(className.empty);
          },
          loading: function() {
            $module.addClass(className.loading);
          },
          placeholderText: function(text) {
            text = text || module.get.placeholderText();
            module.debug('Setting placeholder text', text);
            module.set.text(text);
            $text.addClass(className.placeholder);
          },
          tabbable: function() {
            if( module.is.searchSelection() ) {
              module.debug('Added tabindex to searchable dropdown');
              $search
                .val('')
                .attr('tabindex', 0)
              ;
              $menu
                .attr('tabindex', -1)
              ;
            }
            else {
              module.debug('Added tabindex to dropdown');
              if( $module.attr('tabindex') === undefined) {
                $module
                  .attr('tabindex', 0)
                ;
                $menu
                  .attr('tabindex', -1)
                ;
              }
            }
          },
          initialLoad: function() {
            module.verbose('Setting initial load');
            initialLoad = true;
          },
          activeItem: function($item) {
            if( settings.allowAdditions && $item.filter(selector.addition).length > 0 ) {
              $item.addClass(className.filtered);
            }
            else {
              $item.addClass(className.active);
            }
          },
          partialSearch: function(text) {
            var
              length = module.get.query().length
            ;
            $search.val( text.substr(0, length));
          },
          scrollPosition: function($item, forceScroll) {
            var
              edgeTolerance = 5,
              $menu,
              hasActive,
              offset,
              itemHeight,
              itemOffset,
              menuOffset,
              menuScroll,
              menuHeight,
              abovePage,
              belowPage
            ;

            $item       = $item || module.get.selectedItem();
            $menu       = $item.closest(selector.menu);
            hasActive   = ($item && $item.length > 0);
            forceScroll = (forceScroll !== undefined)
              ? forceScroll
              : false
            ;
            if($item && $menu.length > 0 && hasActive) {
              itemOffset = $item.position().top;

              $menu.addClass(className.loading);
              menuScroll = $menu.scrollTop();
              menuOffset = $menu.offset().top;
              itemOffset = $item.offset().top;
              offset     = menuScroll - menuOffset + itemOffset;
              if(!forceScroll) {
                menuHeight = $menu.height();
                belowPage  = menuScroll + menuHeight < (offset + edgeTolerance);
                abovePage  = ((offset - edgeTolerance) < menuScroll);
              }
              module.debug('Scrolling to active item', offset);
              if(forceScroll || abovePage || belowPage) {
                $menu.scrollTop(offset);
              }
              $menu.removeClass(className.loading);
            }
          },
          text: function(text) {
            if(settings.action === 'combo') {
              module.debug('Changing combo button text', text, $combo);
              if(settings.preserveHTML) {
                $combo.html(text);
              }
              else {
                $combo.text(text);
              }
            }
            else if(settings.action === 'activate') {
              if(text !== module.get.placeholderText()) {
                $text.removeClass(className.placeholder);
              }
              module.debug('Changing text', text, $text);
              $text
                .removeClass(className.filtered)
              ;
              if(settings.preserveHTML) {
                $text.html(text);
              }
              else {
                $text.text(text);
              }
            }
          },
          selectedItem: function($item) {
            var
              value      = module.get.choiceValue($item),
              searchText = module.get.choiceText($item, false),
              text       = module.get.choiceText($item, true)
            ;
            module.debug('Setting user selection to item', $item);
            module.remove.activeItem();
            module.set.partialSearch(searchText);
            module.set.activeItem($item);
            module.set.selected(value, $item);
            module.set.text(text);
          },
          selectedLetter: function(letter) {
            var
              $selectedItem         = $item.filter('.' + className.selected),
              alreadySelectedLetter = $selectedItem.length > 0 && module.has.firstLetter($selectedItem, letter),
              $nextValue            = false,
              $nextItem
            ;
            // check next of same letter
            if(alreadySelectedLetter) {
              $nextItem = $selectedItem.nextAll($item).eq(0);
              if( module.has.firstLetter($nextItem, letter) ) {
                $nextValue  = $nextItem;
              }
            }
            // check all values
            if(!$nextValue) {
              $item
                .each(function(){
                  if(module.has.firstLetter($(this), letter)) {
                    $nextValue = $(this);
                    return false;
                  }
                })
              ;
            }
            // set next value
            if($nextValue) {
              module.verbose('Scrolling to next value with letter', letter);
              module.set.scrollPosition($nextValue);
              $selectedItem.removeClass(className.selected);
              $nextValue.addClass(className.selected);
              if(settings.selectOnKeydown && module.is.single()) {
                module.set.selectedItem($nextValue);
              }
            }
          },
          direction: function($menu) {
            if(settings.direction == 'auto') {
              // reset position, remove upward if it's base menu
              if (!$menu) {
                module.remove.upward();
              } else if (module.is.upward($menu)) {
                //we need make sure when make assertion openDownward for $menu, $menu does not have upward class
                module.remove.upward($menu);
              }

              if(module.can.openDownward($menu)) {
                module.remove.upward($menu);
              }
              else {
                module.set.upward($menu);
              }
              if(!module.is.leftward($menu) && !module.can.openRightward($menu)) {
                module.set.leftward($menu);
              }
            }
            else if(settings.direction == 'upward') {
              module.set.upward($menu);
            }
          },
          upward: function($currentMenu) {
            var $element = $currentMenu || $module;
            $element.addClass(className.upward);
          },
          leftward: function($currentMenu) {
            var $element = $currentMenu || $menu;
            $element.addClass(className.leftward);
          },
          value: function(value, text, $selected) {
            if(value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
              $input.removeClass(className.noselection);
            } else {
              $input.addClass(className.noselection);
            }
            var
              escapedValue = module.escape.value(value),
              hasInput     = ($input.length > 0),
              currentValue = module.get.values(),
              stringValue  = (value !== undefined)
                ? String(value)
                : value,
              newValue
            ;
            if(hasInput) {
              if(!settings.allowReselection && stringValue == currentValue) {
                module.verbose('Skipping value update already same value', value, currentValue);
                if(!module.is.initialLoad()) {
                  return;
                }
              }

              if( module.is.single() && module.has.selectInput() && module.can.extendSelect() ) {
                module.debug('Adding user option', value);
                module.add.optionValue(value);
              }
              module.debug('Updating input value', escapedValue, currentValue);
              internalChange = true;
              $input
                .val(escapedValue)
              ;
              if(settings.fireOnInit === false && module.is.initialLoad()) {
                module.debug('Input native change event ignored on initial load');
              }
              else {
                module.trigger.change();
              }
              internalChange = false;
            }
            else {
              module.verbose('Storing value in metadata', escapedValue, $input);
              if(escapedValue !== currentValue) {
                $module.data(metadata.value, stringValue);
              }
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onChange);
            }
            else {
              settings.onChange.call(element, value, text, $selected);
            }
          },
          active: function() {
            $module
              .addClass(className.active)
            ;
          },
          multiple: function() {
            $module.addClass(className.multiple);
          },
          visible: function() {
            $module.addClass(className.visible);
          },
          exactly: function(value, $selectedItem) {
            module.debug('Setting selected to exact values');
            module.clear();
            module.set.selected(value, $selectedItem);
          },
          selected: function(value, $selectedItem) {
            var
              isMultiple = module.is.multiple()
            ;
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;
            if(!$selectedItem) {
              return;
            }
            module.debug('Setting selected menu item to', $selectedItem);
            if(module.is.multiple()) {
              module.remove.searchWidth();
            }
            if(module.is.single()) {
              module.remove.activeItem();
              module.remove.selectedItem();
            }
            else if(settings.useLabels) {
              module.remove.selectedItem();
            }
            // select each item
            $selectedItem
              .each(function() {
                var
                  $selected      = $(this),
                  selectedText   = module.get.choiceText($selected),
                  selectedValue  = module.get.choiceValue($selected, selectedText),

                  isFiltered     = $selected.hasClass(className.filtered),
                  isActive       = $selected.hasClass(className.active),
                  isUserValue    = $selected.hasClass(className.addition),
                  shouldAnimate  = (isMultiple && $selectedItem.length == 1)
                ;
                if(isMultiple) {
                  if(!isActive || isUserValue) {
                    if(settings.apiSettings && settings.saveRemoteData) {
                      module.save.remoteData(selectedText, selectedValue);
                    }
                    if(settings.useLabels) {
                      module.add.label(selectedValue, selectedText, shouldAnimate);
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.activeItem($selected);
                      module.filterActive();
                      module.select.nextAvailable($selectedItem);
                    }
                    else {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.text(module.add.variables(message.count));
                      module.set.activeItem($selected);
                    }
                  }
                  else if(!isFiltered) {
                    module.debug('Selected active value, removing label');
                    module.remove.selected(selectedValue);
                  }
                }
                else {
                  if(settings.apiSettings && settings.saveRemoteData) {
                    module.save.remoteData(selectedText, selectedValue);
                  }
                  module.set.text(selectedText);
                  module.set.value(selectedValue, selectedText, $selected);
                  $selected
                    .addClass(className.active)
                    .addClass(className.selected)
                  ;
                }
              })
            ;
          },
        },

        add: {
          label: function(value, text, shouldAnimate) {
            var
              $next  = module.is.searchSelection()
                ? $search
                : $text,
              escapedValue = module.escape.value(value),
              $label
            ;
            if(settings.ignoreCase) {
              escapedValue = escapedValue.toLowerCase();
            }
            $label =  $('<a />')
              .addClass(className.label)
              .attr('data-' + metadata.value, escapedValue)
              .html(templates.label(escapedValue, text, settings.preserveHTML, settings.className))
            ;
            $label = settings.onLabelCreate.call($label, escapedValue, text);

            if(module.has.label(value)) {
              module.debug('User selection already exists, skipping', escapedValue);
              return;
            }
            if(settings.label.variation) {
              $label.addClass(settings.label.variation);
            }
            if(shouldAnimate === true) {
              module.debug('Animating in label', $label);
              $label
                .addClass(className.hidden)
                .insertBefore($next)
                .transition({
                    animation  : settings.label.transition,
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    duration   : settings.label.duration
                })
              ;
            }
            else {
              module.debug('Adding selection label', $label);
              $label
                .insertBefore($next)
              ;
            }
          },
          message: function(message) {
            var
              $message = $menu.children(selector.message),
              html     = settings.templates.message(module.add.variables(message))
            ;
            if($message.length > 0) {
              $message
                .html(html)
              ;
            }
            else {
              $message = $('<div/>')
                .html(html)
                .addClass(className.message)
                .appendTo($menu)
              ;
            }
          },
          optionValue: function(value) {
            var
              escapedValue = module.escape.value(value),
              $option      = $input.find('option[value="' + module.escape.string(escapedValue) + '"]'),
              hasOption    = ($option.length > 0)
            ;
            if(hasOption) {
              return;
            }
            // temporarily disconnect observer
            module.disconnect.selectObserver();
            if( module.is.single() ) {
              module.verbose('Removing previous user addition');
              $input.find('option.' + className.addition).remove();
            }
            $('<option/>')
              .prop('value', escapedValue)
              .addClass(className.addition)
              .html(value)
              .appendTo($input)
            ;
            module.verbose('Adding user addition as an <option>', value);
            module.observe.select();
          },
          userSuggestion: function(value) {
            var
              $addition         = $menu.children(selector.addition),
              $existingItem     = module.get.item(value),
              alreadyHasValue   = $existingItem && $existingItem.not(selector.addition).length,
              hasUserSuggestion = $addition.length > 0,
              html
            ;
            if(settings.useLabels && module.has.maxSelections()) {
              return;
            }
            if(value === '' || alreadyHasValue) {
              $addition.remove();
              return;
            }
            if(hasUserSuggestion) {
              $addition
                .data(metadata.value, value)
                .data(metadata.text, value)
                .attr('data-' + metadata.value, value)
                .attr('data-' + metadata.text, value)
                .removeClass(className.filtered)
              ;
              if(!settings.hideAdditions) {
                html = settings.templates.addition( module.add.variables(message.addResult, value) );
                $addition
                  .html(html)
                ;
              }
              module.verbose('Replacing user suggestion with new value', $addition);
            }
            else {
              $addition = module.create.userChoice(value);
              $addition
                .prependTo($menu)
              ;
              module.verbose('Adding item choice to menu corresponding with user choice addition', $addition);
            }
            if(!settings.hideAdditions || module.is.allFiltered()) {
              $addition
                .addClass(className.selected)
                .siblings()
                .removeClass(className.selected)
              ;
            }
            module.refreshItems();
          },
          variables: function(message, term) {
            var
              hasCount    = (message.search('{count}') !== -1),
              hasMaxCount = (message.search('{maxCount}') !== -1),
              hasTerm     = (message.search('{term}') !== -1),
              count,
              query
            ;
            module.verbose('Adding templated variables to message', message);
            if(hasCount) {
              count  = module.get.selectionCount();
              message = message.replace('{count}', count);
            }
            if(hasMaxCount) {
              count  = module.get.selectionCount();
              message = message.replace('{maxCount}', settings.maxSelections);
            }
            if(hasTerm) {
              query   = term || module.get.query();
              message = message.replace('{term}', query);
            }
            return message;
          },
          value: function(addedValue, addedText, $selectedItem) {
            var
              currentValue = module.get.values(),
              newValue
            ;
            if(module.has.value(addedValue)) {
              module.debug('Value already selected');
              return;
            }
            if(addedValue === '') {
              module.debug('Cannot select blank values from multiselect');
              return;
            }
            // extend current array
            if(Array.isArray(currentValue)) {
              newValue = currentValue.concat([addedValue]);
              newValue = module.get.uniqueArray(newValue);
            }
            else {
              newValue = [addedValue];
            }
            // add values
            if( module.has.selectInput() ) {
              if(module.can.extendSelect()) {
                module.debug('Adding value to select', addedValue, newValue, $input);
                module.add.optionValue(addedValue);
              }
            }
            else {
              newValue = newValue.join(settings.delimiter);
              module.debug('Setting hidden input to delimited value', newValue, $input);
            }

            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('Skipping onadd callback on initial load', settings.onAdd);
            }
            else {
              settings.onAdd.call(element, addedValue, addedText, $selectedItem);
            }
            module.set.value(newValue, addedValue, addedText, $selectedItem);
            module.check.maxSelections();
          },
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          activeLabel: function() {
            $module.find(selector.label).removeClass(className.active);
          },
          empty: function() {
            $module.removeClass(className.empty);
          },
          loading: function() {
            $module.removeClass(className.loading);
          },
          initialLoad: function() {
            initialLoad = false;
          },
          upward: function($currentMenu) {
            var $element = $currentMenu || $module;
            $element.removeClass(className.upward);
          },
          leftward: function($currentMenu) {
            var $element = $currentMenu || $menu;
            $element.removeClass(className.leftward);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          activeItem: function() {
            $item.removeClass(className.active);
          },
          filteredItem: function() {
            if(settings.useLabels && module.has.maxSelections() ) {
              return;
            }
            if(settings.useLabels && module.is.multiple()) {
              $item.not('.' + className.active).removeClass(className.filtered);
            }
            else {
              $item.removeClass(className.filtered);
            }
            if(settings.hideDividers) {
              $divider.removeClass(className.hidden);
            }
            module.remove.empty();
          },
          optionValue: function(value) {
            var
              escapedValue = module.escape.value(value),
              $option      = $input.find('option[value="' + module.escape.string(escapedValue) + '"]'),
              hasOption    = ($option.length > 0)
            ;
            if(!hasOption || !$option.hasClass(className.addition)) {
              return;
            }
            // temporarily disconnect observer
            if(selectObserver) {
              selectObserver.disconnect();
              module.verbose('Temporarily disconnecting mutation observer');
            }
            $option.remove();
            module.verbose('Removing user addition as an <option>', escapedValue);
            if(selectObserver) {
              selectObserver.observe($input[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          message: function() {
            $menu.children(selector.message).remove();
          },
          searchWidth: function() {
            $search.css('width', '');
          },
          searchTerm: function() {
            module.verbose('Cleared search term');
            $search.val('');
            module.set.filtered();
          },
          userAddition: function() {
            $item.filter(selector.addition).remove();
          },
          selected: function(value, $selectedItem) {
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;

            if(!$selectedItem) {
              return false;
            }

            $selectedItem
              .each(function() {
                var
                  $selected     = $(this),
                  selectedText  = module.get.choiceText($selected),
                  selectedValue = module.get.choiceValue($selected, selectedText)
                ;
                if(module.is.multiple()) {
                  if(settings.useLabels) {
                    module.remove.value(selectedValue, selectedText, $selected);
                    module.remove.label(selectedValue);
                  }
                  else {
                    module.remove.value(selectedValue, selectedText, $selected);
                    if(module.get.selectionCount() === 0) {
                      module.set.placeholderText();
                    }
                    else {
                      module.set.text(module.add.variables(message.count));
                    }
                  }
                }
                else {
                  module.remove.value(selectedValue, selectedText, $selected);
                }
                $selected
                  .removeClass(className.filtered)
                  .removeClass(className.active)
                ;
                if(settings.useLabels) {
                  $selected.removeClass(className.selected);
                }
              })
            ;
          },
          selectedItem: function() {
            $item.removeClass(className.selected);
          },
          value: function(removedValue, removedText, $removedItem) {
            var
              values = module.get.values(),
              newValue
            ;
            if( module.has.selectInput() ) {
              module.verbose('Input is <select> removing selected option', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              module.remove.optionValue(removedValue);
            }
            else {
              module.verbose('Removing from delimited values', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              newValue = newValue.join(settings.delimiter);
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onRemove);
            }
            else {
              settings.onRemove.call(element, removedValue, removedText, $removedItem);
            }
            module.set.value(newValue, removedText, $removedItem);
            module.check.maxSelections();
          },
          arrayValue: function(removedValue, values) {
            if( !Array.isArray(values) ) {
              values = [values];
            }
            values = $.grep(values, function(value){
              return (removedValue != value);
            });
            module.verbose('Removed value from delimited string', removedValue, values);
            return values;
          },
          label: function(value, shouldAnimate) {
            var
              $labels       = $module.find(selector.label),
              $removedLabel = $labels.filter('[data-' + metadata.value + '="' + module.escape.string(value) +'"]')
            ;
            module.verbose('Removing label', $removedLabel);
            $removedLabel.remove();
          },
          activeLabels: function($activeLabels) {
            $activeLabels = $activeLabels || $module.find(selector.label).filter('.' + className.active);
            module.verbose('Removing active label selections', $activeLabels);
            module.remove.labels($activeLabels);
          },
          labels: function($labels) {
            $labels = $labels || $module.find(selector.label);
            module.verbose('Removing labels', $labels);
            $labels
              .each(function(){
                var
                  $label      = $(this),
                  value       = $label.data(metadata.value),
                  stringValue = (value !== undefined)
                    ? String(value)
                    : value,
                  isUserValue = module.is.userValue(stringValue)
                ;
                if(settings.onLabelRemove.call($label, value) === false) {
                  module.debug('Label remove callback cancelled removal');
                  return;
                }
                module.remove.message();
                if(isUserValue) {
                  module.remove.value(stringValue);
                  module.remove.label(stringValue);
                }
                else {
                  // selected will also remove label
                  module.remove.selected(stringValue);
                }
              })
            ;
          },
          tabbable: function() {
            if( module.is.searchSelection() ) {
              module.debug('Searchable dropdown initialized');
              $search
                .removeAttr('tabindex')
              ;
              $menu
                .removeAttr('tabindex')
              ;
            }
            else {
              module.debug('Simple selection dropdown initialized');
              $module
                .removeAttr('tabindex')
              ;
              $menu
                .removeAttr('tabindex')
              ;
            }
          },
          diacritics: function(text) {
            return settings.ignoreDiacritics ?  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : text;
          }
        },

        has: {
          menuSearch: function() {
            return (module.has.search() && $search.closest($menu).length > 0);
          },
          clearItem: function() {
            return ($clear.length > 0);
          },
          search: function() {
            return ($search.length > 0);
          },
          sizer: function() {
            return ($sizer.length > 0);
          },
          selectInput: function() {
            return ( $input.is('select') );
          },
          minCharacters: function(searchTerm) {
            if(settings.minCharacters && !iconClicked) {
              searchTerm = (searchTerm !== undefined)
                ? String(searchTerm)
                : String(module.get.query())
              ;
              return (searchTerm.length >= settings.minCharacters);
            }
            iconClicked=false;
            return true;
          },
          firstLetter: function($item, letter) {
            var
              text,
              firstLetter
            ;
            if(!$item || $item.length === 0 || typeof letter !== 'string') {
              return false;
            }
            text        = module.get.choiceText($item, false);
            letter      = letter.toLowerCase();
            firstLetter = String(text).charAt(0).toLowerCase();
            return (letter == firstLetter);
          },
          input: function() {
            return ($input.length > 0);
          },
          items: function() {
            return ($item.length > 0);
          },
          menu: function() {
            return ($menu.length > 0);
          },
          message: function() {
            return ($menu.children(selector.message).length !== 0);
          },
          label: function(value) {
            var
              escapedValue = module.escape.value(value),
              $labels      = $module.find(selector.label)
            ;
            if(settings.ignoreCase) {
              escapedValue = escapedValue.toLowerCase();
            }
            return ($labels.filter('[data-' + metadata.value + '="' + module.escape.string(escapedValue) +'"]').length > 0);
          },
          maxSelections: function() {
            return (settings.maxSelections && module.get.selectionCount() >= settings.maxSelections);
          },
          allResultsFiltered: function() {
            var
              $normalResults = $item.not(selector.addition)
            ;
            return ($normalResults.filter(selector.unselectable).length === $normalResults.length);
          },
          userSuggestion: function() {
            return ($menu.children(selector.addition).length > 0);
          },
          query: function() {
            return (module.get.query() !== '');
          },
          value: function(value) {
            return (settings.ignoreCase)
              ? module.has.valueIgnoringCase(value)
              : module.has.valueMatchingCase(value)
            ;
          },
          valueMatchingCase: functio