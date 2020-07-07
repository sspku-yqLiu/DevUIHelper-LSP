let fs = require('fs');
let rootPath = process.cwd();
rootPath=rootPath.replace('\\scripts',"");
let sourcePath = rootPath;
let publishPath = rootPath + '\\Release'
console.log(sourcePath);
console.log(publishPath);
fs.mkdir(publishPath+'/client/node_modules',()=>{});
fs.mkdir(publishPath+'/server/node_modules',()=>{});
//sourcepath->RootPath
var copy = function( src, dst ){
	let file = fs.stat(src,function(err,st){

		if(err){
			throw err;
		}
		if(st.isDirectory()){
			 // 读取目录中的所有文件/目录
			 fs.readdir( src, function( err, paths ){
				if( err ){
					throw err;
				}
				paths.forEach(function( path ){
					let _src = src +'/'+path,
					 _dst = dst +'/'+path;
					fs.stat( _src, function( err, st ){
						if( err ){
							throw err;
						}
						// 判断是否为文件
						if( st.isFile() ){
							copy(src + '/' + path,dst + '/' + path)
						}
						// 如果是目录则递归调用自身
						else if( st.isDirectory() ){
							exists( _src, _dst, copy );
						}
					});
				});
			});
		}
		if(st.isFile()){
			var readable, writable;
			readable = fs.createReadStream( src );
			// 创建写入流
			writable = fs.createWriteStream( dst ); 
			// 通过管道来传输流
			readable.pipe( writable );  
		}
	})
   
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};
copy(sourcePath+'/README.md',publishPath+'/README.md');
copy(sourcePath+'/DevUI.png',publishPath+'/DevUI.png');
copy(sourcePath+'/ChangeLog.md',publishPath+'/ChangeLog.md');
copy(sourcePath+'/package.json',publishPath+'/package.json');
copy(sourcePath+'/server/package.json',publishPath+'/server/package.json');
copy(sourcePath+'/client/package.json',publishPath+'/client/package.json');
console.log('FilesDone, Copy Node modules...');
copy(sourcePath+'/client/node_modules',publishPath+'/client/node_modules');
copy(sourcePath+'/server/node_modules',publishPath+'/server/node_modules');
console.log('FodersDone, Success!');
