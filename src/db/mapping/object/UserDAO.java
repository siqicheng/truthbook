package db.mapping.object;


import db.mapping.baseDAO.BaseHibernateDAO;

import java.sql.Timestamp;
import java.util.List;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.criterion.Example;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import db.mapping.object.User;
import db.mapping.object.UserPassword;

/**
 	* A data access object (DAO) providing persistence and search support for User entities.
 			* Transaction control of the save(), update() and delete() operations 
		can directly support Spring container-managed transactions or they can be augmented	to handle user-managed Spring transactions. 
		Each of these methods provides additional information for how to configure it for the desired type of transaction control. 	
	 * @see db.mapping.object.User
  * @author MyEclipse Persistence Tools 
 */

public class UserDAO extends BaseHibernateDAO  {
	     private static final Logger log = LoggerFactory.getLogger(UserDAO.class);
		//property constants
	public static final String FULL_NAME = "fullName";
	public static final String EMAIL = "email";
	public static final String SCHOOL = "school";
	public static final String ENTRY_TIME = "entryTime";
	public static final String IS_ACTIVATED = "isActivated";
	public static final String TABLE = "User";


    
	public void save(User transientInstance) {
		log.debug("saving User instance");
		try {
			getSession().save(transientInstance);
			UserPassword password = transientInstance.getUserPassword();
			if(password !=null){
				UserPasswordDAO password_dao = new UserPasswordDAO();
				password_dao.getSession().save(password);
//				UserFetchDAO userFetchdao = new UserFetchDAO();
//				userFetchdao.save(new UserFetch(transientInstance, new Timestamp(System.currentTimeMillis())));
			}
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}
	
	public void update(User transientInstance) {
		log.debug("update User instance");
		try {
			getSession().update(transientInstance);
			UserPassword password = transientInstance.getUserPassword();
			if(password !=null){
				UserPasswordDAO password_dao = new UserPasswordDAO();
				password_dao.getSession().update(password);
			}
			log.debug("update successful");
		} catch (RuntimeException re) {
			log.error("update failed", re);
			throw re;
		}
	}

	public void delete(User persistentInstance) {
		log.debug("deleting User instance");
		try {
			getSession().delete(persistentInstance);
			UserPassword password = persistentInstance.getUserPassword();
			if(password !=null){
				UserPasswordDAO password_dao = new UserPasswordDAO();
				password_dao.getSession().delete(password);
			}
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
    
    public User findById( java.lang.Integer id) {
        log.debug("getting User instance with id: " + id);
        try {
            User instance = (User) getSession()
                    .get("db.mapping.object.User", id);
            return instance;
        } catch (RuntimeException re) {
            log.error("get failed", re);
            throw re;
        }
    }
    
    
    public List findByExample(User instance) {
        log.debug("finding User instance by example");
        try {
            List results = getSession()
                    .createCriteria("db.mapping.object.User")
                    .add(Example.create(instance))
            .list();
            log.debug("find by example successful, result size: " + results.size());
            return results;
        } catch (RuntimeException re) {
            log.error("find by example failed", re);
            throw re;
        }
    }    
    
    public List findByProperty(String propertyName, Object value) {
      log.debug("finding User instance with property: " + propertyName
            + ", value: " + value);
      try {
         String queryString = "from User as model where model." 
         						+ propertyName + "= ?";
         Query queryObject = getSession().createQuery(queryString);
		 queryObject.setParameter(0, value);
		 return queryObject.list();
      } catch (RuntimeException re) {
         log.error("find by property name failed", re);
         throw re;
      }
	}

	public List findByFullName(Object fullName
	) {
		return findByProperty(FULL_NAME, fullName
		);
	}
	
	public List findByEmail(Object email
	) {
		return findByProperty(EMAIL, email
		);
	}
	
	public List findBySchool(Object school
	) {
		return findByProperty(SCHOOL, school
		);
	}
	
	public List findByEntryTime(Object entryTime
	) {
		return findByProperty(ENTRY_TIME, entryTime
		);
	}
	
	public List findByIsActivated(Object isActivated
	) {
		return findByProperty(IS_ACTIVATED, isActivated
		);
	}
	

	public List findAll() {
		log.debug("finding all User instances");
		try {
			String queryString = "from User";
	         Query queryObject = getSession().createQuery(queryString);
			 return queryObject.list();
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}
	
    public User merge(User detachedInstance) {
        log.debug("merging User instance");
        try {
            User result = (User) getSession()
                    .merge(detachedInstance);
            log.debug("merge successful");
            return result;
        } catch (RuntimeException re) {
            log.error("merge failed", re);
            throw re;
        }
    }

    public void attachDirty(User instance) {
        log.debug("attaching dirty User instance");
        try {
            getSession().saveOrUpdate(instance);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }
    
    public void attachClean(User instance) {
        log.debug("attaching clean User instance");
        try {
            getSession().lock(instance, LockMode.NONE);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }
}







//package db.mapping.object;
//
//
//import db.mapping.baseDAO.BaseHibernateDAO;
//import java.util.List;
//import org.hibernate.LockMode;
//import org.hibernate.Query;
//import org.hibernate.criterion.Example;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//
//import db.mapping.object.User;
//import db.mapping.object.UserPassword;
//
///**
// 	* A data access object (DAO) providing persistence and search support for User entities.
// 			* Transaction control of the save(), update() and delete() operations 
//		can directly support Spring container-managed transactions or they can be augmented	to handle user-managed Spring transactions. 
//		Each of these methods provides additional information for how to configure it for the desired type of transaction control. 	
//	 * @see db.mapping.object.User
//  * @author MyEclipse Persistence Tools 
// */
//
//public class UserDAO extends BaseHibernateDAO  {
//	     private static final Logger log = LoggerFactory.getLogger(UserDAO.class);
//		//property constants
//	public static final String FULL_NAME = "fullName";
//	public static final String EMAIL = "email";
//	public static final String SCHOOL = "school";
//	public static final String ENTRY_TIME = "entryTime";
//	public static final String IS_ACTIVATED = "isActivated";
//
//
//
//    
//	public void save(User transientInstance) {
//		log.debug("saving User instance");
//		try {
//			getSession().save(transientInstance);
//			UserPassword password = transientInstance.getUserPassword();
//			if(password !=null){
//				UserPasswordDAO password_dao = new UserPasswordDAO();
//				password_dao.getSession().save(password);
//			}
//			log.debug("save successful");
//		} catch (RuntimeException re) {
//			log.error("save failed", re);
//			throw re;
//		}
//	}
//	
//	public void update(User transientInstance) {
//		log.debug("update User instance");
//		try {
//			getSession().update(transientInstance);
//			UserPassword password = transientInstance.getUserPassword();
//			if(password !=null){
//				UserPasswordDAO password_dao = new UserPasswordDAO();
//				password_dao.getSession().update(password);
//			}
//			log.debug("update successful");
//		} catch (RuntimeException re) {
//			log.error("update failed", re);
//			throw re;
//		}
//	}
//
//	public void delete(User persistentInstance) {
//		log.debug("deleting User instance");
//		try {
//			getSession().delete(persistentInstance);
//			UserPassword password = persistentInstance.getUserPassword();
//			if(password !=null){
//				UserPasswordDAO password_dao = new UserPasswordDAO();
//				password_dao.getSession().delete(password);
//			}
//			log.debug("delete successful");
//		} catch (RuntimeException re) {
//			log.error("delete failed", re);
//			throw re;
//		}
//	}
//    
//    public User findById( java.lang.Integer id) {
//        log.debug("getting User instance with id: " + id);
//        try {
//            User instance = (User) getSession()
//                    .get("db.mapping.object.User", id);
//            return instance;
//        } catch (RuntimeException re) {
//            log.error("get failed", re);
//            throw re;
//        }
//    }
//    
//    
//    public List findByExample(User instance) {
//        log.debug("finding User instance by example");
//        try {
//            List results = getSession()
//                    .createCriteria("db.mapping.object.User")
//                    .add(Example.create(instance))
//            .list();
//            log.debug("find by example successful, result size: " + results.size());
//            return results;
//        } catch (RuntimeException re) {
//            log.error("find by example failed", re);
//            throw re;
//        }
//    }    
//    
//    public List findByProperty(String propertyName, Object value) {
//      log.debug("finding User instance with property: " + propertyName
//            + ", value: " + value);
//      try {
//         String queryString = "from User as model where model." 
//         						+ propertyName + "= ?";
//         Query queryObject = getSession().createQuery(queryString);
//		 queryObject.setParameter(0, value);
//		 return queryObject.list();
//      } catch (RuntimeException re) {
//         log.error("find by property name failed", re);
//         throw re;
//      }
//	}
//
//	public List findByFullName(Object fullName
//	) {
//		return findByProperty(FULL_NAME, fullName
//		);
//	}
//	
//	public List findByEmail(Object email
//	) {
//		return findByProperty(EMAIL, email
//		);
//	}
//	
//	public List findBySchool(Object school
//	) {
//		return findByProperty(SCHOOL, school
//		);
//	}
//	
//	public List findByEntryTime(Object entryTime
//	) {
//		return findByProperty(ENTRY_TIME, entryTime
//		);
//	}
//	
//	public List findByIsActivated(Object isActivated
//	) {
//		return findByProperty(IS_ACTIVATED, isActivated
//		);
//	}
//	
//
//	public List findAll() {
//		log.debug("finding all User instances");
//		try {
//			String queryString = "from User";
//	         Query queryObject = getSession().createQuery(queryString);
//			 return queryObject.list();
//		} catch (RuntimeException re) {
//			log.error("find all failed", re);
//			throw re;
//		}
//	}
//	
//    public User merge(User detachedInstance) {
//        log.debug("merging User instance");
//        try {
//            User result = (User) getSession()
//                    .merge(detachedInstance);
//            log.debug("merge successful");
//            return result;
//        } catch (RuntimeException re) {
//            log.error("merge failed", re);
//            throw re;
//        }
//    }
//
//    public void attachDirty(User instance) {
//        log.debug("attaching dirty User instance");
//        try {
//            getSession().saveOrUpdate(instance);
//            log.debug("attach successful");
//        } catch (RuntimeException re) {
//            log.error("attach failed", re);
//            throw re;
//        }
//    }
//    
//    public void attachClean(User instance) {
//        log.debug("attaching clean User instance");
//        try {
//            getSession().lock(instance, LockMode.NONE);
//            log.debug("attach successful");
//        } catch (RuntimeException re) {
//            log.error("attach failed", re);
//            throw re;
//        }
//    }
//}
