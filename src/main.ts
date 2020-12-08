import {
    Plugin,
    Vault,
    Workspace,
    WorkspaceLeaf, 
  } from 'obsidian';
import MindmapView from './mindmap-view';
import { MM_VIEW_TYPE } from './constants';

  
  export default class MarkMap extends Plugin {
    vault: Vault;
    workspace: Workspace;
    mindmapView: MindmapView;
    
    async onload() {
      console.log("Loading Mind Map plugin");
      this.vault = this.app.vault;
      this.workspace = this.app.workspace;

      this.registerView(
        MM_VIEW_TYPE,
        (leaf: WorkspaceLeaf) =>
          (this.mindmapView = new MindmapView(leaf, {path:this.activeLeafPath(this.workspace), basename: this.activeLeafName(this.workspace)}))
      );
      
      this.addCommand({
        id: 'app:markmap-preview',
        name: 'Preview the current note as a Mind Map',
        callback: () => this.markMapPreview(),
        hotkeys: []
      });

    }

    markMapPreview() {
      const fileInfo = {path: this.activeLeafPath(this.workspace), basename: this.activeLeafName(this.workspace)};
      this.initPreview(fileInfo);
    }

    async initPreview(fileInfo: any) {
      if (this.app.workspace.getLeavesOfType(MM_VIEW_TYPE).length > 0) {
        return;
      }
      const preview = this.app.workspace.splitActiveLeaf('horizontal');
      const mmPreview = new MindmapView(preview, fileInfo);
      preview.open(mmPreview);
    }
      
    onunload() {
      console.log("Unloading Mind Map plugin");
    }

    activeLeafPath(workspace: Workspace) {
      return workspace.activeLeaf?.view.getState().file;
    }

    activeLeafName(workspace: Workspace) {
      return workspace.activeLeaf?.getDisplayText();
    }



}