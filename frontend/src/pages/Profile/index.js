import React, {useEffect, useState} from 'react';
import { FiPower, FiTrash2} from 'react-icons/fi';
import { Link, useHistory  } from 'react-router-dom';

import api from '../../services/api'

import logoImage from '../../assets/logo.svg'

import './styles.css';

export default function Profile(){
    const history = useHistory();

    const [incidents, setIncidents] = useState([]);

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then(response => {
            setIncidents(response.data)
        })
    }, [ongId]);

    async function handleDeleteIncident(id)
    {
        try{
           await api.delete(`incidents/${id}`,{
                headers: {
                    Authorization: ongId
                }
           })
           
           setIncidents(incidents.filter(incident => incident.id !== id));

        }catch(error){
            alert("Não foi possível completar a sua solicitação. Tente novamente.")
        }
    }

    function handleLogout()
    {
        localStorage.clear();

        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImage} alt="Be The Hero"/>

                <span>Bem vinda, {ongName}</span>

                <Link className="button " to="/incidents/new">
                    Cadastrar novo Caso
                </Link>

                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency:'BRL'}).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3"></FiTrash2>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}