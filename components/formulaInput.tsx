import React, { useState, useEffect, useRef } from 'react';
import useFormulaStore, { suggestion, Tag } from '@/store/appStore';
import { useSuggestions } from '@/hooks/fetchSuggestion';

const FormulaInput = () => {
  const { tags, addTag, removeTag } = useFormulaStore();
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const inputRef = useRef<HTMLDivElement>(null);
const url = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'

  const { data: suggestions = [], } = useSuggestions(
    url
  );


  useEffect(() => {
    if (query) {
      const filtered = suggestions.filter(
        (s: suggestion) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true); 
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

 
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setQuery(e.currentTarget.innerText.trim());
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      if (query === '' && tags.length > 0) {
        removeTag(tags[tags.length - 1].id); 
      } else if (query.length > 0) {
        setQuery('');
        if (inputRef.current) {
          inputRef.current.innerText = ''; 
        }
      }
    }
  };
  

  const handleSuggestionClick = (suggestion: suggestion) => {
    addTag({ id: suggestion.id, name: suggestion.name, value: suggestion.value });

    if (inputRef.current) {
      inputRef.current.innerText = ''; 
    }

    setQuery('');
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };


  const handleTagClick = (tag: Tag) => {
    setQuery(tag.name);
    setFilteredSuggestions(
      suggestions.filter(
        (s:suggestion) => s.name.toLowerCase().includes(tag.name.toLowerCase())
      )
    );
    setShowSuggestions(true); // Show suggestions
  };

  return (
    <div className="formula-container">
      <div className="input-wrapper">
        {/* Tags */}
        <div className="tags-container">
          {tags.map((tag: Tag) => (
            <span key={tag.id} className="tag" onClick={() => handleTagClick(tag)}>
              {tag.name}
            </span>
          ))}
        </div>

        {/* Input */}
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          className="formula-input"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions">
          {filteredSuggestions.map((s) => (
            <div key={s.id} className="suggestion" onClick={() => handleSuggestionClick(s)}>
              {s.name} ({s.category})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
