var NodeWebcam = require( "node-webcam" );
 
 
//Default options
// 
 var opts = {
//  
//      //Picture related
//       
           width: 1280,
//            

	 height: 720,
//                 
              quality: 100,
//                      
//                       
//                           //Delay to take shot
//                            
                                delay: 0,
//                                 
//                                  
//                                      //Save shots in memory
//                                       
                                           saveShots: true,
//                                            
//                                             
//                                                 // [jpeg, png] support varies
//                                                     // Webcam.OutputTypes
//                                                      
                                                          output: "jpeg",
//                                                           
//                                                            
//                                                                //Which camera to use
//                                                                    //Use Webcam.list() for results
                                                                        //false for default device
                                                                         

	 device: false,
//                                                                              
//                                                                               
//                                                                                   // [location, buffer, base64]
//                                                                                       // Webcam.CallbackReturnTypes
//                                                                                        

	 callbackReturn: "location",
//                                                                                             
//                                                                                              
//                                                                                                  //Logging
//                                                                                                   
//                                                                                                       verbose: false
//                                                                                                        

 };
//                                                                                                         
//                                                                                                          
//                                                                                                          //Creates webcam instance
//                                                                                                           

var Webcam = NodeWebcam.create( opts );
//                                                                                                            
//                                                                                                             
//                                                                                                             //Will automatically append location output type
//                                                                                                              
//                                                                                                               
//                                                                                                                
//                                                                                                                //Also available for quick use
//                                                                                                                 

NodeWebcam.capture( "test_picture", opts, function( err, data ) {
	if ( !err ) 
	{console.log( "Image created!" );
		var Jimp = require("jimp");
		Jimp.read("test_picture.jpg", function(err, result)
			{
				result.rotate(180).write("rotated_image.jpg");
			});
	}
	else
		console.log(err);
});
//                                                                                                                   
//                                                                                                                    
//                                                                                                                    //Get list of cameras
//                                                                                                                     

//                                                                                                                          //Use another device
//                                                                                                                           

//                                                                                                                                 
//                                                                                                                                 //Return type with base 64 image
//                                                                                                                                  
//                                                                                                                                  var opts = {
//                                                                                                                                      callbackReturn: "base64"
//                                                                                                                                      };
//                                                                                                                                       
//                                                                                                                                       NodeWebcam.capture( "test_picture", opts, function( err, data ) {
//                                                                                                                                        
//                                                                                                                                            var image = "<img src='" + data + "'>";
//                                                                                                                                             
//                                                                                                                                             });
