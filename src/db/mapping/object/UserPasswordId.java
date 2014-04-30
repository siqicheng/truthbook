package db.mapping.object;

import java.security.NoSuchAlgorithmException;

import messageDigest.SHA1;



/**
 * UserPasswordId entity. @author MyEclipse Persistence Tools
 */

public class UserPasswordId  implements java.io.Serializable {


    // Fields    

     private String email;
     private String password;

     public static final String SALT = "noChinese";
    // Constructors

    /** default constructor */
    public UserPasswordId() {
    }

    /** full constructor 
     * @throws NoSuchAlgorithmException */
    public UserPasswordId(String email, String password){
        this.email = email;
        this.password = password;
        try{
        	//MessageDigest md = MessageDigest.getInstance("SHA-1");
        	//byte[] bt = md.digest((this.password + SALT).getBytes());
        	this.password = new SHA1().digest(this.password + SALT);
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