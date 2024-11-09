// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ username}) => {
  const [redirectUrl, setRedirectUrl] = useState('');
  const [newLink, setNewLink] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [message,setmessage]=useState("");

  useEffect(() => {
    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function urlmaker(shortid){
     const generatedurl=`https://url-shortener-zmi5.onrender.com/r/${shortid}`;
     return generatedurl;
  }

  // const config = {
  //   headers: {
  //     'Authorization': `Bearer ${token}` 
  //   }
  // }

  const fetchUrls = async () => {
    // Fetch the URLs from the backend
    try{
        const response = await axios.get('https://url-shortener-zmi5.onrender.com/urls', { withCredentials: true });
        setUrls(response.data.entries);
    }
    catch(e){
          console.log(e.response?.data?.error);
    }
  };

  const generateShortUrl = async () => {
    try{
        const response = await axios.post('https://url-shortener-zmi5.onrender.com/urls', { url: redirectUrl }, { withCredentials: true });
        const shorturl=urlmaker(response.data.shortid);
        setShortUrl(shorturl);
        setNewLink(true); 
        fetchUrls(); // Update the table
      //  setUrls([...urls,{shortId:response.data.shortid,redirectUrl,visitHistory:[]}])
    }
    catch(e){
        console.log(e.response?.data?.error);
        setmessage(e.response?.data?.error);
    }
   
  };
 const deleteUrl=async (id)=>{
  try{
        const response=await axios.delete(`https://url-shortener-zmi5.onrender.com/urls/${id}`, { withCredentials: true });
        if(response.data.success){
          fetchUrls();
        } 
  }
  catch(e){
       console.log(e.response?.data?.error);
  }
 }
  const handleNewLink = () => {
    setNewLink(false);
    setRedirectUrl('');
    setShortUrl('');
  };

  return (
    <div className="flex flex-col  items-center p-4 min-h-screen sm:p-6 bg-gray-800">
      {!newLink ? (
        <div  className="mb-8 w-full max-w-xs sm:max-w-md">
          <input
            type="text"
            placeholder="Enter URL to shorten"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
             className="w-auto p-2 border border-gray-600 rounded mr-0 sm:mr-4 mb-4 sm:mb-0"
          />
          <button onClick={generateShortUrl} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded">Generate Short URL</button>
          {message && <p className='text-white my-2'>{message}</p>}
        </div>
      ) : (
        <div  className="mb-8 flex justify-between items-center mx-auto gap-5">
          <p className='text-white'><span>Your short URL is:</span><a href={shortUrl} target='_blank' rel="noreferrer"className="text-blue-400 underline ml-4">{shortUrl}</a></p>
          <button onClick={handleNewLink} className="w-auto bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded">New Link</button>
        </div>
      )}
       <div  className="overflow-auto  max-h-80">
       <table className="min-w-full divide-y divide-gray-200 table-auto table-responsive">
        <thead  className="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="p-2 text-left sm:p-3  md:p-4  text-gray-500  text-xs md:text-base md:px-4 md:py-2  " >#</th>
            <th scope="col" className="p-2 text-left sm:p-3 md:p-4  text-gray-500 text-xs md:text-base md:px-4 md:py-2 " >Short URL</th>
            <th scope="col" className="p-2 text-left sm:p-3 md:p-4  text-gray-500 text-xs md:text-base md:px-4 md:py-2 " >Redirect URL</th>
            <th scope="col" className="p-2 text-left sm:p-3 md:p-4  text-gray-500 text-xs md:text-base md:px-4 md:py-2 " >Total Clicks</th>
            <th scope="col" className="p-2 text-left sm:p-3 md:p-4  text-gray-500 text-xs md:text-base md:px-4 md:py-2 " >Action</th>
          </tr>
        </thead >
        <tbody className="overflow-y-auto bg-black divide-y divide-gray-200">
          {urls.map((url, index) => (
            <tr key={url._id}>
              <td className="p-2 sm:p-3 md:p-4  text-blue-500 ">{index + 1}</td>
              <td className="p-2 sm:p-3 md:p-4  text-blue-500  break-words text-left"> <a href={urlmaker(url.shortId)} target='_blank' rel="noreferrer">{urlmaker(url.shortId)}</a></td>
              <td className="p-2 sm:p-3 md:p-4  text-white  break-words text-left">{url.redirectUrl}</td>
              <td className="p-2 sm:p-3 md:p-4  text-white  break-words text-center">{url.visitHistory.length}</td>
              <td className="p-2 sm:p-3 md:p-4  text-sm md:text-base text-center"><button className="bg-red-500  text-white hover:bg-red-700 active:bg-red-400 font-bold py-2 px-4 rounded" onClick={()=>deleteUrl(url._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
       </div>
     
    </div>
  );
};

export default Dashboard;
