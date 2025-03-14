import {create }from "zustand";

export interface Tag {
    id: number
    name: string;
  }
  export interface suggestion{
    id: number
    name: string;
    category:string
    value:number
  }
    
interface FormulaStore {
  inputValue: string;
  tags: Tag[];
  selectedSuggestion: string | null;
  setInputValue: (value: string) => void;
  addTag: (tag: any) => void;
  removeTag: (id: number) => void;
  setSelectedSuggestion: (suggestion: string ) => void;
}

const useFormulaStore = create<FormulaStore>((set) => ({
  inputValue: "",
  tags: [],
  selectedSuggestion: null,
  setInputValue: (value:string) => set({ inputValue: value }),
  addTag: (tag:Tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (id:number) =>
    set((state:any) => ({ tags: state.tags.filter((tag:Tag) => tag.id !== id) })),
  setSelectedSuggestion: (suggestion:string) => set({ selectedSuggestion: suggestion }),
}));

export default useFormulaStore;
