import { Avatar, Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import ShieldWithPicture from "../ShieldWithPicture/ShieldWithPicture";

interface SuspectCardInterface {
  name: string;
  id: string;
  isRelevant?: boolean;
  photo?: string;
  onClick?: (id: string) => void;
  dateCreated?: string;
}

const SuspectCard: React.FC<SuspectCardInterface> = ({
  name,
  isRelevant,
  photo,
  id,
  onClick,
}) => {
  return (
    <Box
      position="relative"
      width={"11.438rem"}
      height={"15.063rem"}
      sx={{ cursor: "pointer" }}
      onClick={() => onClick && onClick(id)}
    >
      <ShieldWithPicture
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      <Box
        position={"absolute"}
        top={0}
        left={0}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-around"}
        zIndex={1}
      >
        <Box
          position="absolute"
          top="1.4rem"
          width={"100%"}
          textAlign={"center"}
        >
          {isRelevant && (
            <StarIcon
              sx={{
                color: "icon.gold",
                width: "1.538rem",
                height: "1.538rem",
              }}
            />
          )}
        </Box>
        <Box position="absolute" top="3.125rem" textAlign={"center"}>
          <Typography
            color="customText.white"
            fontSize={"1.239rem"}
            fontWeight={600}
          >
            {name}
          </Typography>
          <Typography
            color="customText.white"
            fontSize={"0.839rem"}
            fontWeight={400}
          >
            id: {id}
          </Typography>
        </Box>
        <Box position="absolute" top="6.925rem" textAlign={"center"}>
          <Avatar
            sx={{
              bgcolor: "transparent",
              width: "6.638rem",
              height: "6.638rem",
            }}
            src={photo}
          >
            <AccountCircleIcon
              sx={{
                color: "icon.gray",
                width: "100%",
                height: "100%",
              }}
            />
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
};

export default SuspectCard;
