### Inspiration
Imagine this: I am someone with vision impairment, and every day, having to navigate unfamiliar spaces such as a simple classroom can feel like an overwhelming challenge. It is hard to identify objects or spot obstacles for basic tasks such as finding a vacant seat, locating the trash can and more. These physical barriers not only make the surrounding inaccessible but also makes me feel dependent and disheartened about not being able to do things on my own.

Keeping this user in mind, we built VisionMate - a tool that seamlessly guides users to essential objects, boosts accessibility, and enables safe, independent navigation.

### What it does
VisionMate is a breakthrough-friendly pair of eyes that turns the impossible into possible! As a user, you provide image of the surroundings to DAIN, and use DAIN's speech-to-speech feature to get an in-depth analysis of the surroundings, and steps to perform specific tasks related to navigation.

Powered by cutting-edge AI models like Gemini, SAM2, and DPT, this revolutionary technology transforms unmapped spaces into navigable landscapes. More than a tool— we present a digital guardian that guides, protects, and empowers. We're not just helping visually impaired people move; we're unlocking independence one step at a time.
Navigation reimagined. Accessibility redefined

### How we built it
1. Capture and Process Image: Capture an image using the device’s camera and send it to the DAIN system for processing.
2. Scene Analysis and Task Selection: Utilize the Image Scenario Analyzer to deeply analyze the environment and identify key elements. Prompt the user to choose a task from the following:
  i. Locate a vacant seat.
  ii. Locate a dustbin.
  iii. Locate the blackboard.
3. Task-Based Object Detection:
  a. For Vacant Seat Detection:
    * Send the image to the Seat Occupancy Detection Model.
    * Obtain bounding boxes around vacant seats.
  b. For Dustbin or Blackboard Detection:
    * Send the image to a class-specific YOLOv8 detection model.
    * Retrieve bounding boxes around the specified objects (dustbin or blackboard).
4. Floor Segmentation and Walkable Area Identification: With the image and bounding boxes, use the SAM2 model to segment the floor and highlight safe walkable areas.
5. User Position Marking and Augmentation: Overlay an icon at the bottom center of the image to indicate the user’s current position in the environment.
6. Depth Prediction for Distance Estimation: Run the augmented image through the Depth Prediction Model to estimate the distance between the user and the desired object.
7. Guided Navigation Assistance: Combine the augmented image, depth data, and scene analysis to generate navigation instructions. Use the Navigation Assistance Service Worker on DAIN to produce step-by-step guidance for the user to reach the target.

- Image Scenario Analyzer: Powered by Gemini-1.5-flash, this service uses advanced prompt-engineering techniques, including role-based modeling and structured outputs, to generate detailed JSON data of obstacles and environment type (e.g., classroom, corridor).

- Navigation Assistance Service Worker: Also leveraging Gemini-1.5-flash, this service provides sequential navigation instructions with precision, guiding the user through the environment to the chosen destination.

### Challenges we ran into
Processing images in real-time with high accuracy while keeping latency low was difficult. Models like YOLOv8 and Depth Prediction need considerable computational resources, especially for live feedback.
The quality of images from the camera may vary depending on lighting, angles, and the surrounding environment, making it difficult to accurately detect objects and determine depth.

### Accomplishments that we're proud of
Most current navigation solutions rely on pre-mapped environments, limiting their usefulness in areas that haven't been mapped—a significant drawback given the scarcity of mapped locations. Our solution addresses this gap by enabling navigation in unmapped environments, vastly expanding the accessible area and empowering users to explore without limitations.
Additionally, our solution is designed to be widely accessible. By leveraging decentralized AI and standard camera technology, we eliminate the need for high-performance computing devices, making navigation support available to a broader audience and ensuring computational accessibility for all.
