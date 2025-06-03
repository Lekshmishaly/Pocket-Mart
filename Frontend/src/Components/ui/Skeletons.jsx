import React from "react";
import { Skeleton, Box, Stack, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

//Home Skeleton
export function HomeSkeleton() {
  return (
    <Box sx={{ padding: 2 }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <Skeleton variant="text" width="60%" animation="wave" />
      <Skeleton variant="text" width="40%" animation="wave" />
    </Box>
  );
}

//Product Skeleton
export function ProductSkeleton() {
  return (
    <Box p={2}>
      {/* Title */}
      <Skeleton variant="text" width={220} height={45} sx={{ mb: 3 }} />

      {/* Two-layer Grid */}
      {[...Array(3)].map((_, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 4 }}>
          {/* Left side image/card */}
          <Grid xs={12} sm={6}>
            <Skeleton
              variant="rectangular"
              height={300}
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          {/* Right side content */}
          <Grid xs={12} sm={6}>
            <Skeleton variant="text" width="85%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="80%" height={20} />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

//Order Skeleton / CheckoutSkeleton
export function CheckoutSkeleton() {
  return (
    <Stack spacing={2} padding={2}>
      <Skeleton variant="text" width="50%" height={40} />
      <Skeleton variant="rectangular" height={100} />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="60%" />
    </Stack>
  );
}

//Footer Skeleton
export function FooterSkeleton() {
  return (
    <Stack spacing={1.5} p={2} bgcolor="#0f0f0f">
      {[...Array(3)].map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rectangular"
          animation="wave"
          height={14}
          sx={{
            bgcolor: "#2b2b2b", // dark gray
            borderRadius: "6px",
            width: "100%",
          }}
        />
      ))}
    </Stack>
  );
}

// Header Skeleton
export function HeaderSkeleton() {
  return (
    <Box bgcolor="#0f0f0f" p={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Circular Skeleton */}
        <Skeleton
          variant="circular"
          width={60}
          height={60}
          sx={{ bgcolor: "#2b2b2b" }}
        />

        {/* Text Lines */}
        <Stack spacing={1} flex={1}>
          <Skeleton
            variant="rounded"
            height={12}
            width="80%"
            sx={{ bgcolor: "#2b2b2b", borderRadius: "8px" }}
          />
          <Skeleton
            variant="rounded"
            height={12}
            width="60%"
            sx={{ bgcolor: "#2b2b2b", borderRadius: "8px" }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

// Product Management Skeleton
export function ProductManagement() {
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    py={2}
    borderBottom={1}
    borderColor="divider">
    <Skeleton width={80} height={100} />
    <Skeleton width={100} height={20} />
    <Skeleton width={250} height={20} />
    <Skeleton width={40} height={20} />
    <Skeleton width={100} height={20} />
    <Skeleton width={100} height={20} />
    <Skeleton width={80} height={30} />
    <Skeleton variant="circular" width={30} height={30} />
  </Box>;
}

// DashBoard Skeleton
export function DashboardSkeleton() {
  return (
    <Box p={2}>
      {/* Top Metrics */}
      <Grid container spacing={2}>
        {[...Array(4)].map((_, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Skeleton variant="text" width={100} height={25} />
              <Skeleton variant="text" width={60} height={30} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sales Overview */}
      <Box mt={4}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Skeleton variant="text" width={150} height={30} />
          <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
            <Skeleton variant="rectangular" width={100} height={35} />
            <Skeleton variant="rectangular" width={90} height={35} />
          </Box>
          <Skeleton variant="rectangular" height={220} />
        </Paper>
      </Box>

      {/* Best Selling */}
      <Grid container spacing={2} mt={2}>
        {[...Array(2)].map((_, index) => (
          <Grid xs={12} md={6} key={index}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Skeleton variant="text" width={200} height={30} />
              <Box mt={2}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={60}
                    sx={{ mb: 2 }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Category Skeleton
export function CategorySkeleton() {
  return (
    <Box p={2}>
      {/* Title Skeleton */}
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />

      {/* Category Cards Skeleton */}
      <Grid container spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Grid xs={12} sm={6} md={4} key={index}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={120} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={25} />
              <Skeleton variant="text" width="40%" height={20} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

//EditCategorySkeleton
export function EditCategorySkeleton() {
  return (
    <Stack spacing={1.5} p={2} bgcolor="#0f0f0f">
      {[...Array(3)].map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rectangular"
          animation="wave"
          height={14}
          sx={{
            bgcolor: "#2b2b2b", // dark gray
            borderRadius: "6px",
            width: "100%",
          }}
        />
      ))}
    </Stack>
  );
}
