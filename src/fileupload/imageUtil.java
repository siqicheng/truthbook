package fileupload;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

public class imageUtil {
	public static boolean resize(String src, String dist, double width, double height){
		try{
			File srcfile = new File(src);
			if (!srcfile.exists()){
				return false;
			}
			
			BufferedImage image = ImageIO.read(srcfile);
			
			double ratio = 1.0;
            if (image.getHeight() > height || image.getWidth() > width) {
                if (image.getHeight() > image.getWidth()) {
                    ratio = height / image.getHeight();
                } else {
                    ratio = width / image.getWidth();
                }
            }
            
            int newWidth = (int) (image.getWidth() * ratio);
            int newHeight = (int) (image.getHeight() * ratio);
            
            BufferedImage bfImage = new BufferedImage(newWidth, newHeight,
                    BufferedImage.TYPE_INT_RGB);
            bfImage.getGraphics().drawImage(
                    image.getScaledInstance(newWidth, newHeight,
                            Image.SCALE_SMOOTH), 0, 0, null);

            FileOutputStream os = new FileOutputStream(dist);
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(os);
            encoder.encode(bfImage);
            os.close();
            
            return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		
	}
	
	public static boolean resizeSmall(String src){
		String filename = src.substring(src.lastIndexOf(File.separatorChar)+1);
//		Pattern pfn = Pattern.compile(filename);
		String dist = src.replace(filename , "Small"+filename);
		return resize(src, dist ,110 ,110);
	}
	
	public static boolean resizeMedium(String src){
		String filename = src.substring(src.lastIndexOf(File.separatorChar)+1);
		String dist = src.replace(filename , "Medium"+filename);
		return resize(src, dist ,400 ,400);
	}
	
	public static boolean resizeLarge(String src){
		String filename = src.substring(src.lastIndexOf(File.separatorChar)+1);
		String dist = src.replace(filename , "Large"+filename);
		return resize(src, dist ,1024 ,1024);
	}
}
