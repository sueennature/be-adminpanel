'use client'
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAuthRedirect } from '@/utils/checkToken';
import Checkbox from '@mui/material/Checkbox';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
interface RoomFormData {
  name: string;
  category: string;
  max_adults: string;
  max_childs: string;
  max_people: string;
  room_only: string;
  bread_breakfast: string;
  half_board: string;
  full_board: string;
  features: string;
  views: string[];
  size: string;
  beds: string;
  bathroom: string;
  secondary_category: string;
  description: string;
  short_description: string;
  images: string[];
}

const UpdateRoom = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    category: '',
    max_adults: '',
    max_childs: '',
    max_people: '',
    room_only: '',
    bread_breakfast: '',
    half_board: '',
    full_board: '',
    features: '',
    views: [],
    size: '',
    beds: '',
    bathroom: '',
    secondary_category: '',
    description: '',
    short_description: '',
    images: []
  });
  const searchParams = useSearchParams();
  let roomId = searchParams.get("roomID");
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); 
  const [startTime, setStartTime] = React.useState<Dayjs | null>(null);
  const [endTime, setEndTime] = React.useState<Dayjs | null>(null);

  const fileInputRef = useRef<any>(null);
  const handleDeleteImage = async (index: number) => {
    const imageUrl = formData.images[index];
    if (imageUrl) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            console.log("IMAGEURL", imageUrl);
            try {
                await axios.delete(`${process.env.BE_URL}/rooms/${roomId}/images`, {
                    data: { files_to_delete: [imageUrl] }, 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                        'x-api-key': process.env.X_API_KEY,
                    },
                });

                setImagePreviews(prevImages => prevImages.filter((_, i) => i !== index));
                setFormData(prevData => ({
                    ...prevData,
                    images: prevData.images.filter((_, i) => i !== index),
                }));

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                Swal.fire(
                    'Deleted!',
                    'Your image has been deleted.',
                    'success'
                );
            } catch (err) {
                console.error('Error deleting image:', err);
                toast.error('Error deleting image');
            }
        }
    }
};
  useEffect(() => {
    const fetchRooms = async () => {
      if (roomId) {
        try {
          const accessToken = Cookies.get("access_token");

          const response = await axios.get(
            `${process.env.BE_URL}/rooms/${roomId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "x-api-key": process.env.X_API_KEY,
              },
            },
          );

          setFormData(response.data);
          if (response.data.images && Array.isArray(response.data.images)) {
            setImagePreviews(response.data.images);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchRooms();
  }, [roomId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const base64Promises = filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      });
  
      Promise.all(base64Promises)
        .then(base64Images => {
          setFormData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...base64Images]
          }));
          setImagePreviews(prevImages => [...prevImages, ...base64Images]);
        })
        .catch(error => {
          console.error('Error converting images to base64:', error);
          toast.error('Error uploading images');
        });
    }
  };
  
  
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const urlToBase64 = async (url: string): Promise<string> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
  
    const convertImagesToBase64 = async (urls: string[]): Promise<string[]> => {
      const base64Promises = urls.map(url =>
        url.startsWith('uploads/') ? urlToBase64(`https://api.sueennature.com/${url}`) : Promise.resolve(url)
      );
      return Promise.all(base64Promises);
    };
  
    try {
      const base64Images = await convertImagesToBase64(formData.images);
      const { images, ...roomData } = formData;

      const processedFormData = {
        ...formData,
        images: base64Images
      };
  
      const response = await fetch('/api/room/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: roomId, ...processedFormData }),
      });
  
      const result = await response.json();
      if(response.status === 401){
        toast.error("Credentials Expired. Please Log in Again")
        Cookies.remove('access_token');
        setTimeout(()=>{
          router.push('/')
        },1500)
        return;
      }
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update item');
      }
  
      toast.success('Room updated successfully');
      setTimeout(() => {
        router.push("/rooms");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('An error occurred, Please Login Again');
    }
  };
  

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
    
            <div className="w-full xl:w-1/4">
            <label className="mb-3 block text-sm font-medium text-black">
                First Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                                    <option value="">Select a room category</option>
                <option value="Single">Single </option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Family">Family</option>
                  <option value="Triple">Triple</option>
                </select>
            </div>
            <div className="w-full xl:w-1/4">
            <label className="mb-3 block text-sm font-medium text-black">
                Second Category
                </label>
                <select
                 name="secondary_category"
                 
                 value={formData.secondary_category}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                >
                  <option value="">Select a room  second category</option>
                  <option value="Single">Single </option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Family">Family</option>
                  <option value="Triple">Triple</option>
                </select>
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Views
              </label>
              <input
                type="text"
                name="views"
                required
                placeholder="Enter the Views : hill, garden"
                value={formData.views}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/3">
              <label className="mb-3 block text-sm font-medium text-black">
                Max Adults
              </label>
              <input
                type="number"
                name="max_adults"
                required
                placeholder="No of Adults"
                value={formData.max_adults}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/3">
              <label className="mb-3 block text-sm font-medium text-black">
                Max Children
              </label>
              <input
                type="number"
                name="max_childs"
                required
                placeholder="No of Children"
                value={formData.max_childs}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/3">
              <label className="mb-3 block text-sm font-medium text-black">
                Max People
              </label>
              <input
                type="number"
                name="max_people"
                required
                placeholder="No of People"
                value={formData.max_people}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <p className='mb-3 mt-3 text-xl font-bold'>First Category</p>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Room Only
              </label>
              <input
                type="number"
                name="room_only"
                required
                placeholder="Room Only"
                value={formData.room_only}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Bread & Breakfast
              </label>
              <input
                type="number"
                name="bread_breakfast"
                required
                placeholder="Bread & Breakfast"
                value={formData.bread_breakfast}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Half Board
              </label>
              <input
                type="number"
                name="half_board"
                required
                placeholder="Half Board"
                value={formData.half_board}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Full Board
              </label>
              <input
                type="number"
                name="full_board"
                required
                placeholder="Full Board"
                value={formData.full_board}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <p className='mb-3 mt-3 text-xl font-bold'>Second Category</p>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Room Only
              </label>
              <input
                type="number"
                name="room_only"
                required
                placeholder="Room Only"
                value={""}
                //onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Bread & Breakfast
              </label>
              <input
                type="number"
                name="bread_breakfast"
                required
                placeholder="Bread & Breakfast"
                value={""}
                //onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Half Board
              </label>
              <input
                type="number"
                name="half_board"
                required
                placeholder="Half Board"
                value={""}
                //onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Full Board
              </label>
              <input
                type="number"
                name="full_board"
                required
                placeholder="Full Board"
                value={""}
                //onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Room Size
              </label>
              <input
                type="text"
                name="size"
                required
                placeholder="Enter Room Size : 350 sq. ft"
                value={formData.size}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                No of Beds
              </label>
              <input
                type="text"
                name="beds"
                required
                placeholder="Enter Number of Beds"
                value={formData.beds}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Bathroom
              </label>
              <input
                type="text"
                name="bathroom"
                required
                placeholder="Enter Bathroom Details"
                value={formData.bathroom}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Features
              </label>
              <input
                type="text"
                name="features"
                required
                placeholder="Enter Room Features"
                value={formData.features}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={5}
                name="description"
                required
                placeholder="Enter Room Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black">
                Short Description
              </label>
              <textarea
                rows={5}
                name="short_description"
                required
                placeholder="Enter Short Description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
          </div>
          <label className="mb-3 mt-3 text-xl font-bold">
            Room Status
          </label>
          <div className="flex items-center space-x-4 mb-6">
            <Checkbox {...label} />
            <label className="mr-2">Availability</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={startTime} onChange={(newValue) => setStartTime(newValue)} />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={endTime} onChange={(newValue) => setEndTime(newValue)} />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          
          <div className="mb-4">
            <label className="mb-3 block text-sm font-medium text-black">
              Upload Room Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}  // Assign the ref to the input
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />           
          </div>
          <div className="mb-6.5">
            <label className="mb-3 block text-sm font-medium text-black">
              Image Preview
            </label>
            <div className="flex items-start lg:items-center gap-4 flex-col lg:flex-row ">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <Image
      src={image.startsWith('data:') ? image : `https://api.sueennature.com/${image}`}
      alt={`Preview ${index}`}
      width={100}
      height={100}
      className="object-cover rounded h-20"
    />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="relative top-[-80px] left-[80px]  text-red bg-red-500 rounded-full font-bold"
                  >
                    X
                  </button>
                </div>
              ))}


            </div>
            
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full rounded bg-primary py-2 text-white font-semibold hover:bg-primary-dark focus:bg-primary-dark"
          >
           {loading ? "Updating..." : "Update"} 
           </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
