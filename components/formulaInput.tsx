import React, { useState, useEffect } from 'react';

import { useSuggestions } from '@/hooks/fetchSuggestion';
import useFormulaStore, { suggestion, Tag } from '@/store/appStore';

const FormulaInput = () => {
    const { inputValue, tags, setInputValue, addTag, removeTag } = useFormulaStore();
  const [query, setQuery] = useState('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
  const { data: suggestions, isLoading } = useSuggestions(query);
  const [filteredSuggestions, setFilteredSuggestions] = useState<suggestion[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    if (suggestions) {
      const filtered = suggestions.filter((suggestion: suggestion) => {
        return (
          suggestion.name.includes(inputValue) ||
          suggestion.category.includes(inputValue) ||
          String(suggestion.value).includes(inputValue)
        );
      });
      setFilteredSuggestions(filtered);
    }
  }, [suggestions, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setQuery(value); 
  };

  const handleSuggestionClick = (suggestion: suggestion) => {
    addTag({ id: suggestion.id, name: suggestion.name, value: suggestion.value });
    setInputValue(suggestion.value);
    setQuery('');
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '') {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        removeTag(lastTag.id);
      }
    }
  };

  const handleTagRemove = (id: number) => {
    removeTag(id);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div>
      {tags.map((tag: Tag) => (
          <div key={tag.id} style={{ display: 'inline-block', margin: '4px', padding: '4px', border: '1px solid #ccc' }}>
            {tag.name}
            <button onClick={() => toggleDropdown(tag.id)}>▼</button>
            {openDropdownId === tag.id && (
              <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc' }}>
                <div onClick={() => handleTagRemove(tag.id)}>Delete</div>
              </div>
            )}
          </div>
        ))}
    <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // handleKeyDown is used here
        placeholder="Enter formula..."
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {inputValue && filteredSuggestions.map((suggestion: suggestion) => (
            <div key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} className='dropdown'>
              {suggestion.name} ({suggestion.category}) {suggestion.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaInput;