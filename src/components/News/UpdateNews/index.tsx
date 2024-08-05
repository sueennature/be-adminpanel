'use client'
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from 'react'
import SelectGroupOne from '../../SelectGroup/SelectGroupOne'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from "next/image";

interface NewsFormData {
    title: string;
    content: string;
    images: (File | string)[];
    videos: (File | string)[];
}

const UpdateNews = () => {
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    images: [],
    videos: []
  });

  const searchParams = useSearchParams();
  let newsId = searchParams.get("newsID");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); 

  const handleDeleteImage = (index: number) => {
    setImagePreviews((prevImages) => prevImages.filter((_, i) => i !== index));
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteVideo = (index: number) => {
    setVideoPreviews(prevVideos => prevVideos.filter((_, i) => i !== index));
    setFormData(prevData => ({
      ...prevData,
      videos: prevData.videos.filter((_, i) => i !== index),
    }));
  };

  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileReaders = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((base64Strings) => {
        if (type === 'image') {
          setImagePreviews(prevImages => [...prevImages, ...base64Strings]);
          setFormData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...base64Strings]
          }));
        } else if (type === 'video') {
          setVideoPreviews(prevVideos => [...prevVideos, ...base64Strings]);
          setFormData(prevData => ({
            ...prevData,
            videos: [...prevData.videos, ...base64Strings]
          }));
        }
      }).catch((error) => {
        console.error("Error converting files to base64:", error);
      });
    }
  };


  useEffect(() => {
    const fetchNews = async () => {
      if (newsId) {
        try {
          const accessToken = Cookies.get('access_token'); 

          const response = await axios.get(`${process.env.BE_URL}/news/${newsId}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                  'x-api-key': process.env.X_API_KEY, 
              },
          });
          console.log(response.data.data);
          setFormData(response.data.data)
          if (response.data.data.images && Array.isArray(response.data.data.images)) {
            setImagePreviews(response.data.data.images);
          }
          if (response.data.data.videos && Array.isArray(response.data.data.videos)) {
            setVideoPreviews(response.data.data.videos);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchNews();
  }, [newsId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/news/update', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: newsId, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to update item');
      }

      toast.success('News updated successfully');
      setTimeout(() => {
        router.push('/news');
      }, 1000);
    
    } catch (err) {
      console.log(err);
      toast.error('An error occurred');
    }
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, 'image');
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, 'video');
  };
  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter the Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Image
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Image Preview
              </label>
              <div className="flex items-center gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="object-cover rounded h-20"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="relative top-[-80px] left-[80px] text-red bg-red-500 rounded-full font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Video
              </label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="mb-6.5">
              <label className="mb-3 block text-sm font-medium text-black">
                Video Previews
              </label>
              <div className="flex flex-col gap-4">
                {videoPreviews.map((video, index) => (
                  <div key={index} className="relative">
                    <video
                      src={video}
                      controls
                      width="140"
                      height="100"
                      className="object-cover rounded h-20"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(index)}
                      className="relative top-[-80px] left-[120px] text-red bg-red-500 rounded-full font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Content
              </label>
              <textarea
                rows={6}
                name="content"
                required
                placeholder="Type Content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
            </div>
          
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNews;
