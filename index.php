<?php 
  if($_SERVER['REQUEST_URI'] == '/'){
      echo render('index.html');
  }
  else{
    $path = explode('?',$_SERVER['REQUEST_URI']);
    $path = $path[0];
    $base_path_theme = 'C:\xampp\htdocs\renify\themes\students';

    $folder = explode('/',$path)[1];

    if($folder == 'js'  || $folder == 'css' || $folder == 'assets' || $folder == 'custom'){
      if($folder == 'custom' || $folder == 'js'){
       header("Content-Type:application/javascript");  
      }
      echo  file_get_contents($base_path_theme.$path); 
    }

    if(str_contains($folder,'.html')){
      echo  render($base_path_theme.$path); 
    }

    if($folder == 'api'){
      $path = $_SERVER['REQUEST_URI'];
       $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://renify.local".$path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);   
        echo $output;
    }

  }

  function render($url){
    $content = file_get_contents($url);
     return str_replace('<!DOCTYPE html>', '', $content);
  }

?>
