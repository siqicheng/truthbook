package db.mapping.object;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;



/**
 * UserPasswordId entity. @author MyEclipse Persistence Tools
 */

public class UserPasswordId  implements java.io.Serializable {


    // Fields    

     private String email;
     private String password;

     public static final String SALT = "noChinese";
//     public static final Integer SALT_LENGTH = 7;
//     public static String getRandomString(int length) {
//    	 String base = "abcdefghijklmnopqrstuvwxyz0123456789";   
//    	 Random random = new Random();   
//    	 StringBuffer sb = new StringBuffer();   
//    	 for (int i = 0; i < length; i++) {   
//    		 int number = random.nextInt(base.length());   
//    		 sb.append(base.charAt(number));   
//    	 }   
//    	 return sb.toString();   
//     }  
    // Constructors

    /** default constructor */
    public UserPasswordId() {
    }

    private static String bytes2hex(byte bt[]){
        StringBuilder sb = new StringBuilder();
        for (byte b : bt) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
    
    /** full constructor 
     * @throws NoSuchAlgorithmException */
    public UserPasswordId(String email, String password){
        this.email = email;
        this.password = password;
       // this.salt = getRandomString();
        try{
        	MessageDigest md = MessageDigest.getInstance("SHA-1");
        	byte[] bt = md.digest((this.password + SALT).getBytes());
        	this.password = bytes2hex(bt);
        } catch (Exception e){
        	e.printStackTrace();
        }
       
    }

   
    // Property accessors
  	
    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
   



   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof UserPasswordId) ) return false;
		 UserPasswordId castOther = ( UserPasswordId ) other; 
         
		 return ( (this.getEmail()==castOther.getEmail()) || ( this.getEmail()!=null && castOther.getEmail()!=null && this.getEmail().equals(castOther.getEmail()) ) )
 && ( (this.getPassword()==castOther.getPassword()) || ( this.getPassword()!=null && castOther.getPassword()!=null && this.getPassword().equals(castOther.getPassword()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getEmail() == null ? 0 : this.getEmail().hashCode() );
         result = 37 * result + ( getPassword() == null ? 0 : this.getPassword().hashCode() );
         return result;
   }   

}