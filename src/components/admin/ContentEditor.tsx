import { Plus, Trash2, Type, Image as ImageIcon } from "lucide-react";

interface ContentEditorProps {
  formData: any;
  setFormData: (data: any) => void;
  takeaways: string[];
  setTakeaways: (data: string[]) => void;
  paragraphs: any[];
  setParagraphs: (data: any[]) => void;
}

export default function ContentEditor({ 
  formData, setFormData, 
  takeaways, setTakeaways, 
  paragraphs, setParagraphs 
}: ContentEditorProps) {

  // --- Helpers for Takeaways ---
  const handleAddTakeaway = () => setTakeaways([...takeaways, ""]);
  const handleRemoveTakeaway = (idx: number) => setTakeaways(takeaways.filter((_, i) => i !== idx));
  const handleTakeawayChange = (idx: number, val: string) => {
    const newArr = [...takeaways];
    newArr[idx] = val;
    setTakeaways(newArr);
  };

  // --- Helpers for Paragraphs ---
  // Added 'imageUrl' to initial state
  const handleAddParagraph = () => setParagraphs([...paragraphs, { title: "", text: "", imageUrl: "" }]);
  const handleRemoveParagraph = (idx: number) => setParagraphs(paragraphs.filter((_, i) => i !== idx));
  
  // Updated to handle 'imageUrl' field
  const handleParagraphChange = (idx: number, field: string, val: string) => {
    const newArr = [...paragraphs];
    newArr[idx][field] = val;
    setParagraphs(newArr);
  };

  return (
    <div className="p-8 rounded-3xl bg-card border border-border-subtle shadow-2xl space-y-8">
       
       {/* 1. Title Input */}
       <div>
          <label className="text-sm font-bold text-text-secondary mb-2 block">Post Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-transparent text-3xl md:text-4xl font-bold text-text-primary placeholder:text-text-secondary/30 border-b border-border-subtle focus:border-accent-purple outline-none pb-2 transition-all"
            placeholder="Enter your title here..."
          />
       </div>

       {/* 2. Summary Input */}
       <div>
          <label className="text-sm font-bold text-text-secondary mb-2 block">Summary</label>
          <textarea 
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            rows={3}
            className="w-full bg-main/50 text-text-primary rounded-xl border border-border-subtle p-4 placeholder:text-text-secondary/50 focus:border-accent-purple outline-none resize-none"
            placeholder="Write a catchy summary..."
          />
       </div>

       {/* 3. Key Takeaways */}
       <div>
          <label className="text-sm font-bold text-text-secondary mb-3 flex items-center justify-between">
            <span>Key Takeaways</span>
            <button onClick={handleAddTakeaway} className="text-xs flex items-center gap-1 text-accent-purple hover:text-white">
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </label>
          <div className="space-y-2">
            {takeaways.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center text-xs font-bold mt-2 shrink-0">{idx + 1}</div>
                <input 
                  type="text" 
                  value={item}
                  onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                  className="flex-1 bg-main/30 border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
                  placeholder="Key point..."
                />
                <button onClick={() => handleRemoveTakeaway(idx)} className="text-text-secondary hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
       </div>

       {/* 4. Paragraphs Section */}
       <div>
          <label className="text-sm font-bold text-text-secondary mb-4 flex items-center justify-between">
            <span>Content Sections</span>
            <button onClick={handleAddParagraph} className="text-xs flex items-center gap-1 text-accent-orange hover:text-white">
              <Plus className="w-3 h-3" /> Add Section
            </button>
          </label>
          
          <div className="space-y-6">
            {paragraphs.map((para, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-main/30 border border-border-subtle relative group hover:border-text-secondary/30 transition-colors">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleRemoveParagraph(idx)} className="text-text-secondary hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="space-y-4">
                   {/* Title Input */}
                   <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-text-secondary" />
                      <input 
                        type="text"
                        value={para.title}
                        onChange={(e) => handleParagraphChange(idx, "title", e.target.value)}
                        placeholder="Section Title (Optional)"
                        className="bg-transparent font-bold text-text-primary placeholder:text-text-secondary/50 focus:outline-none w-full"
                      />
                   </div>

                   {/* Text Area */}
                   <textarea 
                      value={para.text}
                      onChange={(e) => handleParagraphChange(idx, "text", e.target.value)}
                      rows={4}
                      placeholder="Write your paragraph content here..."
                      className="w-full bg-main/50 rounded-lg border border-border-subtle/50 p-3 text-sm text-text-secondary focus:text-text-primary focus:border-accent-orange outline-none resize-y"
                   />

                   {/* NEW: Optional Image Input */}
                   <div className="flex gap-2 items-center">
                      <ImageIcon className="w-4 h-4 text-text-secondary shrink-0" />
                      <input 
                        type="text"
                        value={para.imageUrl}
                        onChange={(e) => handleParagraphChange(idx, "imageUrl", e.target.value)}
                        placeholder="Optional Image URL for this section..."
                        className="w-full bg-main/50 rounded-lg border border-border-subtle/50 px-3 py-2 text-xs text-text-secondary focus:border-accent-purple outline-none"
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>
       </div>

    </div>
  );
}