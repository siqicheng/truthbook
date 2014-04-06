package db.mapping.baseDAO;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;

import db.mapping.object.Relationship;
import sessionFactory.HibernateSessionFactory;


/**
 * Data access object (DAO) for domain model
 * @author MyEclipse Persistence Tools
 */
public class BaseHibernateDAO implements IBaseHibernateDAO {
	
	public Session getSession() {
		return HibernateSessionFactory.getSession();
	}	
	
	public List findByProperties(String propertyName[], Object value[],String table) {
		try {
			
			if(propertyName.length!=value.length){
				return null;
			}
			
			String sql_frag = "model." + propertyName[0] + "= ?";
			for (int i=1; i<propertyName.length;i++){
				sql_frag = sql_frag + " and " + "model." + propertyName[i] + "= ?";
			}
			
			String queryString = "from " + table + " as model where " + sql_frag;			
			Query queryObject = getSession().createQuery(queryString);
			
			for (int i=0; i<value.length;i++){
				queryObject.setParameter(i, value[i]);
			}
			
			return queryObject.list();
		} catch (RuntimeException re) {
			throw re;
		}
	}
	
	public List findByPropertiesBySQL(Object propertyName[], Object value[],String table, Class Entity) throws Exception {
		try {
			
			if(propertyName.length!=value.length){
				return null;
			}
			
			String sql_frag = "model." + propertyName[0] + "= ?";
			for (int i=1; i<propertyName.length;i++){
				sql_frag = sql_frag + " and " + "model." + propertyName[i] + "= ?";
			}
			
			String queryString = "select user_id,friend_id,cast(relationship as varchar),is_invitee from " + table + " as model where " + sql_frag;
			
			Query queryObject = getSession().createSQLQuery(queryString).setResultTransformer(Transformers.aliasToBean(Entity));
			
			for (int i=0; i<value.length;i++){
				queryObject.setParameter(i, value[i]);
			}
			
			return queryObject.list();
		} catch (RuntimeException re) {
			throw re;
		}
	}
}
