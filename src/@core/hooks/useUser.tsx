import {useState, useEffect} from 'react';
import {useRouter} from "next/router";
import axios from 'axios';
import useCSRFToken from "./useCsrf";

const useUser = () => {

  type UserData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;

  };

  useCSRFToken();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const fetchUserData = async () => {

      const token = sessionStorage.getItem('access_token');

      try {

        const response = await axios.post(`https://api.ecovoit.tech/api/me`, undefined, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUserData(response.data);

      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
        await router.push('/pages/login');

      } finally {
        setLoading(false);
      }

    };

    fetchUserData();

  }, [router]);

  return {userData, loading};

};

export default useUser;
