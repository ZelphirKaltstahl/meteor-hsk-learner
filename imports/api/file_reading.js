export var read_file = function(file, on_load_callback){
    var reader = new FileReader();
    reader.onload = on_load_callback;
    reader.readAsText(file);
};
