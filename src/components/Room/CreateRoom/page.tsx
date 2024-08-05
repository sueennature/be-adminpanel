'use client'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
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
    images: []
  });

  const router = useRouter();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
      setFormData({
        ...formData,
        [name]: value
      });
    }
    const [loading, setLoading] = useState(false); 

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
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
            images: []
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
                  placeholder="Enter the Views"
                  value={formData.views}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
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
              </div>
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
              </div>
            </div>
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
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach file
              </label>
              <input
                type="file"
                multiple
                name='images'
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Description
              </label>
              <textarea
                rows={6}
                name="description"
                required
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
                required
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
