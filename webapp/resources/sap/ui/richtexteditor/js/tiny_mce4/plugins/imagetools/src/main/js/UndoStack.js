define("tinymce/imagetoolsplugin/UndoStack",[],function(){return function(){var d=[],i=-1;function a(s){var e;e=d.splice(++i);d.push(s);return{state:s,removed:e};}function u(){if(c()){return d[--i];}}function r(){if(b()){return d[++i];}}function c(){return i>0;}function b(){return i!=-1&&i<d.length-1;}return{data:d,add:a,undo:u,redo:r,canUndo:c,canRedo:b};};});
