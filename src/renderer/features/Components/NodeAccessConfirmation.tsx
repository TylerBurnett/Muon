import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface NodeAccessConfirmationDialogueProps {
  open: boolean;
  onClose: (result: boolean) => void;
}

const NodeAccessConfirmationDialogue: React.FC<NodeAccessConfirmationDialogueProps> =
  ({ open, onClose }) => {
    return (
      <Dialog
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Approve Node Access for Component?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Components with malicious intent can do serious damage to your
            computer if given Node access. Please only enable this feature only
            if a component needs it AND is trusted.
          </DialogContentText>

          <DialogContentText id="alert-dialog-description">
            This application is not liable for any damages or malicious
            activities that are conducted through the activation of this feature
            for this component.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(true)} color="primary" autoFocus>
            Agree
          </Button>

          <Button onClick={() => onClose(false)} color="primary">
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default NodeAccessConfirmationDialogue;
