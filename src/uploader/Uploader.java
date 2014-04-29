package uploader;
import com.qiniu.api.auth.digest.Mac;
import com.qiniu.api.config.Config;
import com.qiniu.api.io.IoApi;
import com.qiniu.api.io.PutExtra;
import com.qiniu.api.io.PutRet;
import com.qiniu.api.rs.PutPolicy;
public class Uploader {
	
		private String uptoken;
	
		public Uploader(){
			try{
				Config.ACCESS_KEY = "pe900649n4vrkaQwWWcWjouUxCzgnXzAxtgQILnn";
				Config.SECRET_KEY = "D8FjTL6HJJa9-QvJNq-XvZ095ksUfE8eGmmZ_zLv";
				Mac mac = new Mac(Config.ACCESS_KEY, Config.SECRET_KEY);
		        String bucketName = "truthbookwinkar";
		        PutPolicy putPolicy = new PutPolicy(bucketName);
		        uptoken = putPolicy.token(mac);
			} catch (Exception e){
				e.printStackTrace();
			}
		}
		
		public void upload(String key, String localFile){
			try{
				PutExtra extra = new PutExtra();
				PutRet ret = IoApi.putFile(uptoken, key, localFile, extra);
				System.out.println(ret.response);
			} catch (Exception e){
				e.printStackTrace();
			}
	        
		}	
}
