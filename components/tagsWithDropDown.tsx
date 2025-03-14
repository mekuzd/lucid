import { Tag } from "@/store/appStore";
import { useState } from "react";

export default function TagWithDropdown (tag:Tag)  {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div style={{ display: 'inline-block', margin: '4px', padding: '4px', border: '1px solid #ccc' }} key={tag.id}>
        {tag.name}
        <button onClick={() => setIsOpen(!isOpen)}>▼</button>
        {isOpen && (
          <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc' }}>
            <div>Edit</div>
            <div>Delete</div>
          </div>
        )}
      </div>
    );
  };