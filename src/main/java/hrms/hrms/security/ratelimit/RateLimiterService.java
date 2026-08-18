package hrms.hrms.security.ratelimit;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

@Service
public class RateLimiterService {

    // Maximum allowed requests per time window per client
    private static final int MAX_REQUESTS_PER_WINDOW = 20;
    private static final long WINDOW_DURATION_MS = 60_000; // 1 minute

    private static class ClientRequestBucket {
        long windowStartTime;
        AtomicInteger count;

        ClientRequestBucket(long windowStartTime) {
            this.windowStartTime = windowStartTime;
            this.count = new AtomicInteger(1);
        }
    }

    private final ConcurrentHashMap<String, ClientRequestBucket> clientBuckets = new ConcurrentHashMap<>();

    public boolean allowRequest(String clientId) {
        long now = System.currentTimeMillis();

        clientBuckets.compute(clientId, (key, bucket) -> {
            if (bucket == null || now - bucket.windowStartTime > WINDOW_DURATION_MS) {
                return new ClientRequestBucket(now);
            } else {
                bucket.count.incrementAndGet();
                return bucket;
            }
        });

        ClientRequestBucket bucket = clientBuckets.get(clientId);
        return bucket != null && bucket.count.get() <= MAX_REQUESTS_PER_WINDOW;
    }
}
