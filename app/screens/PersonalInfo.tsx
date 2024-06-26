import React from 'react';
import { View, Text } from 'react-native';
import { Title } from 'react-native-paper';
import Slider from '../components/Slider';
import PersonalCard from '../components/PersonalCard';
import Description from '../components/Description';
import BtnPersonal from '../components/BtnPersonal';
import Layout from '../components/Layout';

export default function PersonalInfo(){
    return(
        <>
        <Layout>
        <PersonalCard/>
            
            <Slider/>
            <Description/>
            <BtnPersonal/>
            </Layout>
        </>
    );
}

