'use client'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState,useRef,useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css'; // Import flatpickr CSS

interface RoomFormData {
  room_number:string;
  name: string;
  category: string;
  view:string;
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
  secondary_room_only:string;
  secondary_bread_breakfast:string;
  secondary_half_board:string;
  secondary_full_board:string;
 
}

const CreateRoom = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    room_number:"",
    name:"",
    category: '',
    max_adults: '',
    max_childs: '',
    view:"",
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
    images: [],
    secondary_room_only:'',
    secondary_bread_breakfast:'',
    secondary_half_board:'',
    secondary_full_board:'',
    
  });
  const [errors, setErrors] = useState<any>({
    room_number:"",
    name:"",
    category: '',
    max_adults: '',
    max_childs: '',
    view:"",
    max_people: '',
    room_only: '',
    bread_breakfast: '',
    half_board: '',
    full_board: '',
    features: '',
    views: '',
    size: '',
    beds: '',
    bathroom: '',
    secondary_category: '',
    description: '',
    short_description: '',
    images: '',
    secondary_room_only:'',
    secondary_bread_breakfast:'',
    secondary_half_board:'',
    secondary_full_board:'',
  });
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);  //set tooltip
  const router = useRouter();
  
  const [loading, setLoading] = useState(false); 
   
    
  const handleChange = (e: any) => {
      const { name, value } = e.target;
      
        setFormData({
          ...formData,
          [name]: value
        });

        // Conditional validation logic
  if (name === "secondary_category") {
    if (value !== "") {
      // If a secondary category is selected, set required validation for secondary prices
      setErrors((prevErrors:any) => ({
        ...prevErrors,
        secondary_room_only: formData.secondary_room_only ? "" : "Room Only price is required",
        secondary_bread_breakfast: formData.secondary_bread_breakfast ? "" : "Bread and Breakfast price is required",
        secondary_half_board: formData.secondary_half_board ? "" : "Half Board price is required",
        secondary_full_board: formData.secondary_full_board ? "" : "Full Board price is required",
      }));
    } else {
      // If secondary category is deselected, clear errors
      setErrors((prevErrors :any) => ({
        ...prevErrors,
        secondary_room_only: "",
        secondary_bread_breakfast: "",
        secondary_half_board: "",
        secondary_full_board: "",
      }));
    }
  }
        // Validate the input as it's being changed
        validateField(name, value);
      }
   const validateField = (name: string, value: string) => {
        let error = '';
    
        switch (name) {
            case 'room_number':
                if (!value.trim()) {
                    error = 'Room Name is required';
                }
                break;
    
            case 'category':
                if (!value.trim()) {
                    error = 'Room Primary category is required';
                }
                break;
            case 'view':
                  if (!value.trim()) {
                      error = 'Room view is required';
                  }
                  break;  
            case 'max_adults':
                    if (!value.trim()) {
                        error = 'Amount of Maximum Adult is required';
                    }
                    break;  
            case 'max_childs':
                      if (!value.trim()) {
                          error = 'Amount of Maximum Children is required';
                      }
                      break; 
            case 'max_people':
                        if (!value.trim()) {
                            error = 'Amount of Maximum People is required';
                        }
                        break; 
            case 'views':
                          if (!value.trim()) {
                              error = 'Room view is required';
                          }
                          break; 
            case 'room_only':
                            if (!value.trim()) {
                                error = 'Price for Room only is required';
                            }
                            break;  
            case 'bread_breakfast':
                            if (!value.trim()) {
                                  error = 'Price for bread and breakfast room is required';
                              }
                              break; 
            case 'half_board':
                          if (!value.trim()) {
                                    error = 'Price for half board room is required';
                                }
                                break; 
            case 'full_board':
                          if (!value.trim()) {
                                      error = 'Price for full board room is required';
                                  }
                                  break; 
            case 'secondary_room_only':
                                    if (!value.trim()) {
                                        error = 'Price for Room only is required';
                                    }
                                    break;  
            case 'secondary_bread_breakfast':
                                    if (!value.trim()) {
                                          error = 'Price for bread and breakfast room is required';
                                      }
                                      break; 
            case 'secondary_half_board':
                                  if (!value.trim()) {
                                            error = 'Price for half board room is required';
                                        }
                                        break; 
           case 'secondary_full_board':
                                  if (!value.trim()) {
                                              error = 'Price for full board room is required';
                                          }
                                          break; 
          case 'features':
                                            if (!value.trim()) {
                                                error = 'Features required';
                                            }
                                            break;  
          case 'size':
                                            if (!value.trim()) {
                                                  error = 'Room size is required';
                                              }
                                              break; 
                            case 'beds':
                                          if (!value.trim()) {
                                                    error = 'Beds is required';
                                                }
                                                break; 
                            case 'bathroom':
                                          if (!value.trim()) {
                                                      error = 'bathroom is required';
                                                  }
                                                  break;                                                                                          

    
            
    
            
    
            
    
            // Add additional validation cases as needed
    
            default:
                break;
        }
    
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: error,
        }));
    };  
      
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        const oversizedFiles = filesArray.filter(file => file.size > 1024 * 1024); // 1 MB in bytes
        if (oversizedFiles.length > 0) {
        
          setErrors((prevErrors :any) => ({
              ...prevErrors,
              profile_image: 'File size must be less than 1 MB',
          }));
      } else {
        setTooltipMessage(null);
          setErrors((prevErrors :any) => ({
              ...prevErrors,
              profile_image: '',
          }));
        const base64Promises = filesArray.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        });
  
        Promise.all(base64Promises)
          .then(base64Images => {
            setFormData({
              ...formData,
              images: base64Images
            });
          })
          .catch(error => {
            console.error("Error converting images to base64:", error);
            toast.error("Error uploading images");
          });
      }
    };
  };

  const handleFocus = () => {
    if (!tooltipMessage) {
      setTooltipMessage('Please upload an image smaller than 1 MB');
    }
  };

    const removeBase64Prefix = (base64String: string) => {
      // Define the prefixes for PNG and JPEG
      const pngPrefix = 'data:image/png;base64,';
      const jpegPrefix = 'data:image/jpeg;base64,';
    
      // Check for PNG prefix and remove it if present
      if (base64String.startsWith(pngPrefix)) {
        return base64String.substring(pngPrefix.length);
      }
    
      // Check for JPEG prefix and remove it if present
      if (base64String.startsWith(jpegPrefix)) {
        return base64String.substring(jpegPrefix.length);
      }
    
      // Return the original string if no known prefix is found
      return base64String;
    };
    

      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const processedFormData = {
          ...formData,
        images: formData.images?.map(removeBase64Prefix) // Process each base64 image
        };
        setLoading(true); 
        console.log('Form Data:', formData);
        console.log("PROCESSED ROOM",processedFormData);

        try {
          const response = await fetch('/api/room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            toast.error(`Failed to create room: ${errorData.error || 'Unknown error'}`);
            return;
          }
    
          if(response.status === 401){
            toast.error("Credentials Expired. Please Log in Again")
            Cookies.remove('access_token');
            setTimeout(()=>{
              router.push('/')
            },1500)
            return;
          }
          const data = await response.json();
          toast.success("Room created successfully");

          setFormData({
            room_number:"",
            name: '',
            category: '',
            max_adults: '',
            max_childs: '',
            view: "",
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
            images: [],
            secondary_room_only:'',
            secondary_bread_breakfast:'',
            secondary_half_board:'',
            secondary_full_board:'',
          });
          setTimeout(()=>{
            router.push("/rooms")
          })
        } catch (error) {
          console.error('Error:', error);
          toast.error("An error occurred while creating the room");
          setLoading(false); 

        }
      };
  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Room No
              </label>
              <input
                type="text"
                name="room_number"
                required
                placeholder="Enter the Room Name"
                value={formData.room_number}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.room_number && <p className="text-red text-sm">{errors.room_number}</p>}
            </div>

            <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white placeholder:text-md text-sm"
                >
                <option value="">Select a room category</option>
                <option value="Single">Single </option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Double">Double</option>
                  <option value="Family">Family</option>
                  <option value="Triple">Triple</option>
                </select>
                {errors.category && <p className="text-red text-sm">{errors.category}</p>}
              </div>
              
            <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                Second Category
                </label>
                <select
                 name="secondary_category"
                 
                 value={formData.secondary_category}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white placeholder:text-md text-sm"
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
                  placeholder="Enter the Views"
                  value={formData.views}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.views && <p className="text-red text-sm">{errors.views}</p>}
              </div>
          </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  View
                </label>
                <input
                  type="text"
                  name="view"
                  required
                  placeholder="Enter the Views : hill, garden"
                  value={formData.view}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.view && <p className="text-red text-sm">{errors.view}</p>}
              </div>
              <div className="w-full xl:w-1/4">
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
                {errors.max_adults && <p className="text-red text-sm">{errors.max_adults}</p>}
              </div>
              <div className="w-full xl:w-1/4">
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
                {errors.max_childs && <p className="text-red text-sm">{errors.max_childs}</p>}
              </div>
              <div className="w-full xl:w-1/4">
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
                {errors.max_people && <p className="text-red text-sm">{errors.max_people}</p>}
              </div>
            </div>
            {/* Title Label for First Category */}
            <div className="mb-6.5">
              <h2 className="text-lg font-semibold text-black">Primary Category Prices</h2>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Room Only
                </label>
                <input
                  type="number"
                  name="room_only"
                  required
                  placeholder="Enter the price"
                  value={formData.room_only}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.room_only && <p className="text-red text-sm">{errors.room_only}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Bread and Breakfast
                </label>
                <input
                  type="number"
                  name="bread_breakfast"
                  required
                  placeholder="Enter the price"
                  value={formData.bread_breakfast}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.bread_breakfast && <p className="text-red text-sm">{errors.bread_breakfast}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Half Board
                </label>
                <input
                  type="number"
                  name="half_board"
                  required
                  placeholder="Enter the price"
                  value={formData.half_board}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.half_board && <p className="text-red text-sm">{errors.half_board}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Full Board
                </label>
                <input
                  type="number"
                  name="full_board"
                  required
                  placeholder="Enter the price"
                  value={formData.full_board}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.full_board && <p className="text-red text-sm">{errors.full_board}</p>}
              </div>
            </div>
            {/* Title Label for First Category */}
            <div className="mb-6.5">
              <h2 className="text-lg font-semibold text-black">Secondary Category Prices</h2>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Room Only
                </label>
                <input
                  type="number"
                  name="secondary_room_only"
                  placeholder="Enter the price"
                  value={formData.secondary_room_only}
                  onChange={handleChange}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white ${
                    errors.secondary_room_only ? 'border-red' : ''
                  }`}
                />
                {errors.secondary_room_only && <p className="text-red text-sm">{errors.secondary_room_only}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Bread and Breakfast
                </label>
                <input
                  type="number"
                  name="secondary_bread_breakfast"
                  placeholder="Enter the price"
                  value={formData.secondary_bread_breakfast}
                  onChange={handleChange}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white ${
                    errors.secondary_bread_breakfast ? 'border-red' : ''
                  }`}
                />
                {errors.secondary_bread_breakfast && <p className="text-red text-sm">{errors.secondary_bread_breakfast}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Half Board
                </label>
                <input
                  type="number"
                  name="secondary_half_board"
                  placeholder="Enter the price"
                  value={formData.secondary_half_board}
                  onChange={handleChange}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white ${
                    errors.secondary_half_board ? 'border-red' : ''
                  }`}
                />
                {errors.secondary_half_board && <p className="text-red text-sm">{errors.secondary_half_board}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Full Board
                </label>
                <input
                  type="number"
                  name="secondary_full_board"
                  placeholder="Enter the price"
                  value={formData.secondary_full_board}
                  onChange={handleChange}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white ${
                    errors.secondary_full_board ? 'border-red' : ''
                  }`}
                />
                {errors.secondary_full_board && <p className="text-red text-sm">{errors.secondary_full_board}</p>}
              </div>
            </div>

            {/* Horizontal separator */}
            <hr className="my-10 border-t border-stroke" />
            
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Features
                </label>
                <input
                  type="text"
                  name="features"
                  required
                  placeholder="Enter the Features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.features && <p className="text-red text-sm">{errors.features}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  required
                  placeholder="Enter the Size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.size && <p className="text-red text-sm">{errors.size}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Beds
                </label>
                <input
                  type="text"
                  name="beds"
                  required
                  placeholder="Enter the beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.beds && <p className="text-red text-sm">{errors.beds}</p>}
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Bathroom
                </label>
                <input
                  type="text"
                  name="bathroom"
                  required
                  placeholder="Enter the Bathrooms"
                  value={formData.bathroom}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
                {errors.bathroom && <p className="text-red text-sm">{errors.bathroom}</p>}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach file
              </label>
              {tooltipMessage && (
        <div className="mt-2 text-sm text-red">
            {tooltipMessage}
        </div>
    )}
              <input
                type="file"
                multiple
                name='images'
                required
                onChange={handleFileChange}
                onFocus={handleFocus}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
              {errors.profile_image && (
            <p className="text-red text-sm mt-1">{errors.profile_image}</p>
        )}
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={6}
                name="description"
                placeholder="Type description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Short Description
              </label>
              <textarea
                rows={6}
                name="short_description"
                placeholder="Type short description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
             {loading ? "Submitting..." : "Submit"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
