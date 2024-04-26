import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {
  const [user,setUser]=useState(null);
  const {username}=useParams()
  const showToast=useShowToast();
  useEffect(()=>{
    const getUser=async()=>{
      try {
        const res=await fetch(`/api/users/profile/${username}`)
        const data=await res.json();
         if(data.error){
          showToast("Error",data.error,"error")
          return;
         }
         setUser(data);               // ye global state wala user nhi hai ,ye iska user hai
      } catch (error) {
        showToast("Error",data,"error")
      }
    }
    getUser();
  },[username,showToast])

  if(!user)return null;

  return (
    <>
     <UserHeader user={user}/>
     <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads."/>
     <UserPost likes={324} replies={3645} postImg="/post2.png" postTitle="Let's talk utkarsh about threads."/>
     <UserPost likes={325} replies={434} postImg="/post3.png" postTitle="Let's threads."/>
     <UserPost likes={35} replies={44} postTitle="My first thread"/>
     
    </>
  )
}

export default UserPage
