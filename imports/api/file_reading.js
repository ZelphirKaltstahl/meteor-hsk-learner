export var read_file = function(file, on_load_callback){
    var reader = new FileReader();
    reader.onload = on_load_callback;
    reader.readAsText(file);
};

export var write_file = function(data, file_path) {
    console.log('data:', data);
    var file = new File(file_path, "write");
    var str = JSON.stringify(data);

    file.open();
    file.writeline(str);
    file.close();
}
